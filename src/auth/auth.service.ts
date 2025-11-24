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
import { AccessTokenPayload, RefreshTokenPayload } from './types/types'

interface LoginOrRegisterResponse {
    isNewUser: boolean
    tempToken?: string
    userId?: string
    access_token?: string
    refresh_token?: string
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
                {
                    expiresIn: '5m',
                    secret: process.env.SECRET_TOKEN,
                },
            )
            return { isNewUser, tempToken, userId }
        }
        // TODO: check if user has other identities as branch employee if isNewUser = false
        isNewUser = false
        console.log('User already exists, loging user...')
        const { access_token, refresh_token } = await this.generateUserTokens(
            userExists.id,
        )
        return { isNewUser, access_token, refresh_token }
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

            const refreshTokenPayload: RefreshTokenPayload = {
                userId,
                sessionId,
            }

            const access_token = await this.jwtService.signAsync(
                accessTokenPayload,
                {
                    expiresIn: '15m',
                    secret: process.env.SECRET_TOKEN,
                },
            )

            const refresh_token = await this.jwtService.signAsync(
                refreshTokenPayload,
                {
                    expiresIn: '7d',
                    secret: process.env.REFRESH_SECRET_TOKEN,
                },
            )

            return { userId, refresh_token, access_token }
        } catch (err) {
            throw new InternalServerErrorException(
                `Error creating session: ${err}`,
            )
        }
    }

    async refreshUserTokens(oldRefreshToken: string) {
        try {
            const payload = (await this.jwtService.verifyAsync(
                oldRefreshToken,
                {
                    secret: process.env.REFRESH_SECRET_TOKEN,
                },
            )) as RefreshTokenPayload

            const accessTokenPayload: AccessTokenPayload = {
                userId: payload.userId,
                sessionId: payload.sessionId,
                identityId: payload.userId,
                // TODO: change this to handle different identity types (if user is a branch employee)
                identityType: 'user',
            }

            const refreshTokenPayload: RefreshTokenPayload = {
                userId: payload.userId,
                sessionId: payload.sessionId,
            }

            const newAccessToken = await this.jwtService.signAsync(
                accessTokenPayload,
                {
                    secret: process.env.SECRET_TOKEN,
                    expiresIn: '1h',
                },
            )
            const newRefreshToken = await this.jwtService.signAsync(
                refreshTokenPayload,
                {
                    secret: process.env.REFRESH_SECRET_TOKEN,
                    expiresIn: '7d',
                },
            )

            return { newAccessToken, newRefreshToken }
        } catch (error) {
            throw new InternalServerErrorException(
                `Error refreshing session: ${error}`,
            )
        }
    }
}
