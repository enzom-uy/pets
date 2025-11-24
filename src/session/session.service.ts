import { DATABASE_CONNECTION } from '@/db/db.module'
import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from 'drizzle/schema'
import { v4 as uuid } from 'uuid'

@Injectable()
export class SessionService {
    constructor(
        @Inject(DATABASE_CONNECTION)
        private db: NodePgDatabase<typeof schema>,
    ) {}

    async createSession(
        userId: string,
        refreshToken: string,
        userIp: string,
        userAgent: string,
        tx?: NodePgDatabase<typeof schema>,
    ) {
        const db = tx || this.db
        try {
            const id = uuid()
            const session = await db
                .insert(schema.sessions)
                .values({
                    id,
                    userId,
                    token: refreshToken,
                    ipAddress: userIp,
                    userAgent,
                    expiresAt: new Date(
                        Date.now() + 1000 * 60 * 60 * 24 * 7,
                    ).toISOString(),
                })
                .returning()
            console.log(session[0])
            return session[0]
        } catch (error) {
            throw new InternalServerErrorException(
                `Error creating session: ${error}`,
            )
        }
    }
}
