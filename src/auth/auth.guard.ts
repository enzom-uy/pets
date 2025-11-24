import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { PinoLogger } from 'nestjs-pino'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly logger: PinoLogger,
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>()
        const cookies = request.cookies

        const accessToken = cookies['access_token']

        if (!accessToken) {
            this.logger.warn('No access token found')
            throw new UnauthorizedException('No access token found')
        }

        try {
            await this.jwtService.verifyAsync(accessToken, {
                secret: process.env.SECRET_TOKEN,
            })
            return true
        } catch (error) {
            this.logger.warn(error, 'Access token verification failed')
            throw new UnauthorizedException('Access token verification failed')
        }
    }
}
