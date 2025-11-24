import { Controller, Inject, Post, Req, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { Request, Response } from 'express'
import * as schema from 'drizzle/schema'
import { randomUUID } from 'crypto'
import { SessionService } from '@/session/session.service'
import { AuthService } from '@/auth/auth.service'
import { DATABASE_CONNECTION } from '@/db/db.module'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

interface UserFromForm {
    name: string
    email: string
    city: string
    address: string | null
}

@Controller('user')
export class UserController {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly authService: AuthService,
    ) {}

    @Post('create')
    async createUser(@Req() req: Request, @Res() res: Response) {
        const { name, email, city, address } = req.body as UserFromForm

        try {
            const result = await this.db.transaction(async (tx) => {
                const user: typeof schema.users.$inferInsert = {
                    id: randomUUID(),
                    name,
                    email,
                    city,
                    address,
                }

                const createdUser = await this.userService.createUser(user)
                const userTokens = await this.authService.generateUserTokens(
                    createdUser.id,
                )
                const userIp = req.ip || 'unknown'
                const userAgent = req.get('user-agent') || 'unknown'
                const userSession = await this.sessionService.createSession(
                    createdUser.id,
                    userTokens.refresh_token,
                    userIp,
                    userAgent,
                    tx,
                )

                return { createdUser, userTokens, userSession }
            })
            return result
        } catch (error) {
            console.error('Error creating user:', error)
            res.status(500).json({ error: 'Failed to create user' })
        }
    }
}
