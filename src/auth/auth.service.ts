import { Inject, Injectable } from '@nestjs/common'
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
                    isTemporary: true,
                },
                { expiresIn: '5m' },
            )
            return { isNewUser, tempToken, userId }
        }
        isNewUser = false
        console.log('User already exists, loging user...')
        return { isNewUser }
    }
}
