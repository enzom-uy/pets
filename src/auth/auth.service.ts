import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { GoogleService } from './google/google.service'
import { JwtService } from '@nestjs/jwt'
import { DATABASE_CONNECTION } from 'src/db/db.module'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from 'drizzle/schema'
import { UserService } from '@/user/user.service'
import { v4 as uuid } from 'uuid'

interface LoginOrRegisterResponse {
    isNewUser: boolean
    tempToken?: string
    userId?: string
}

interface AccessTokenPayload {
    userId: string
    sessionId: string
    identityId: string
    identityType: 'user' | 'branch' | 'owner'
}

@Injectable()
export class AuthService {
    constructor(
        @Inject(DATABASE_CONNECTION)
        private db: NodePgDatabase<typeof schema>,

        private googleService: GoogleService,
        private jwtService: JwtService,
        private userService: UserService,
    ) {}

    googleAuth(): { url: string } {
        return this.googleService.getOAuth2ClientUrl()
    }

    async getAuthClientData(code: string): Promise<{
        email: string
        name: string
        refreshToken: string
        accessToken: string
    }> {
        return this.googleService.getAuthClientData(code)
    }

    async loginOrRegisterUser(
        email: string,
        username: string,
        userAgent: string,
        ip: string,
    ): Promise<LoginOrRegisterResponse> {
        const userExists = await this.userService.findByEmail(email)
        let isNewUser = false

        if (!userExists) {
            isNewUser = true
            const userId = uuid()
            const tempToken = await this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    username,
                    userAgent,
                    ip,
                    isTemporary: true,
                },
                { expiresIn: '5m' },
            )
            return { isNewUser, tempToken, userId }
        }
        // TODO: check if user has other identities as branch employee if isNewUser = false
        isNewUser = false
        console.log('User already exists, loging user...')
        return { isNewUser }
    }

    async generateUserTokens(userId: string) {
        try {
            const sessionId = uuid()
            const accessTokenPayload: AccessTokenPayload = {
                userId: userId,
                sessionId: sessionId,
                identityId: userId,
                identityType: 'user',
            }

            const refreshTokenPayload = {
                userId,
                sessionId,
            }

            const access_token = await this.jwtService.signAsync(
                accessTokenPayload,
                { expiresIn: '15m' },
            )

            const refresh_token = await this.jwtService.signAsync(
                refreshTokenPayload,
                { expiresIn: '7d' },
            )

            return { userId, refresh_token, access_token }
        } catch (err) {
            throw new InternalServerErrorException(
                `Error creating session: ${err}`,
            )
        }
    }
}
