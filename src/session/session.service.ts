import { DATABASE_CONNECTION } from '@/db/db.module'
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from 'drizzle/schema'

@Injectable()
export class SessionService {
    private readonly logger = new Logger(SessionService.name)

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
            const session = await db
                .insert(schema.sessions)
                .values({
                    userId,
                    token: refreshToken,
                    ipAddress: userIp,
                    userAgent,
                    expiresAt: new Date(
                        Date.now() + 1000 * 60 * 60 * 24 * 7,
                    ).toISOString(),
                })
                .returning()
            return session[0]
        } catch (error) {
            this.logger.error(
                `Error creating session for user ${userId}: ${error}`,
                error instanceof Error ? error.stack : undefined,
            )
            throw new InternalServerErrorException(
                'Could not create session. Please try again later.',
            )
        }
    }
}
