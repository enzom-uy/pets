import {
    Controller,
    Get,
    Post,
    Query,
    Redirect,
    Req,
    Res,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { PinoLogger } from 'nestjs-pino'
import { JwtService } from '@nestjs/jwt'
import { Response, Request, CookieOptions } from 'express'
import * as schema from 'drizzle/schema'

export const CREATE_PROFILE_URL = 'http://localhost:4321/create-profile'
export const TEMP_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 5 * 60 * 1000,
} as CookieOptions

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
        @Req() req: Request,
    ) {
        const { email, name: username } =
            await this.authService.getAuthClientData(code)

        this.logger.info({ username, email }, 'Login with google data')

        const userAgent = req.headers['user-agent'] as string
        const ipAddress = req.ip || 'unknown'

        const { isNewUser, tempToken } =
            await this.authService.loginOrRegisterUser(
                email,
                username,
                userAgent,
                ipAddress,
            )

        if (isNewUser && tempToken) {
            // TODO: Additional sign-in logic
            res.cookie('tempToken', tempToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 5 * 60 * 1000,
            })
            return res.redirect(CREATE_PROFILE_URL)
        }
        return res.redirect('http://localhost:4321/')
    }

    @Get('signed-in')
    signedIn(): { signedIn: boolean } {
        return { signedIn: true }
    }

    // TODO: this
    @Post('create-session')
    async createUserSession(@Query() user: typeof schema.users.$inferSelect) {}
}
