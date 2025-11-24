import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>()
        const cookies = request.cookies

        const accessToken = cookies['access_token']

        if (!accessToken) {
            return false
        }

        try {
            await this.jwtService.verifyAsync(accessToken, {
                secret: process.env.SECRET_TOKEN,
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}
