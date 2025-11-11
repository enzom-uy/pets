import { Controller, Get, Query, Redirect, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PinoLogger } from 'nestjs-pino'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly logger: PinoLogger,
        private jwtService: JwtService,
    ) {}

    @Get('google')
    @Redirect()
    googleAuth(): { url: string } {
        return this.authService.googleAuth()
    }

    @Get('google/callback')
    async googleAuthCallback(
        @Query('code') code: string,
        @Res() res: Response,
    ) {
        const {
            email,
            refreshToken,
            accessToken,
            name: username,
        } = await this.authService.getAuthClientData(code)

        this.logger.info(
            { username, email, refreshToken, accessToken },
            'Login with google data',
        )

        const { isNewUser, tempToken } =
            await this.authService.loginOrRegisterUser(email, username)

        if (isNewUser && tempToken) {
            // TODO: Additional sign-in logic
            res.cookie('tempToken', tempToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 5 * 60 * 1000,
            })
            return res.redirect('http://localhost:3000/creating-profile')
        }
    }

    @Get('signed-in')
    signedIn(): { signedIn: boolean } {
        return { signedIn: true }
    }
}
