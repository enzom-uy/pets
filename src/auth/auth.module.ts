import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleService } from './google/google.service'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '@/user/user.module'

@Module({
    controllers: [AuthController],
    providers: [AuthService, GoogleService],
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_TOKEN,
            signOptions: { expiresIn: '60s' },
        }),
        UserModule,
    ],
})
export class AuthModule {}
