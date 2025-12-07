import { DATABASE_CONNECTION } from '@/db/db.module'
import {
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from 'drizzle/schema'
import { PinoLogger } from 'nestjs-pino'
import { DatabaseError } from 'pg'

@Injectable()
export class ServiceService {
    constructor(
        @Inject(DATABASE_CONNECTION)
        private readonly db: NodePgDatabase<typeof schema>,
        private readonly logger: PinoLogger,
    ) {}

    async createService(
        serviceName: string,
        tx?: NodePgDatabase<typeof schema>,
    ) {
        const db = tx || this.db

        if (!serviceName || serviceName === '') {
            throw new Error('Service Name must be a valid string.')
        }

        try {
            const serviceValues: typeof schema.services.$inferInsert = {
                name: serviceName,
            }
            const createdService = await db
                .insert(schema.services)
                .values(serviceValues)
                .returning()
            return createdService[0]
        } catch (err) {
            const error = err as DatabaseError
            if (error.code === '23505') {
                throw new ConflictException(
                    'Service with this name already exists.',
                )
            }

            this.logger.error(
                `Error creating service: ${error.message}`,
                error.stack,
            )
            throw new InternalServerErrorException(
                `Could not create service. Please try again later.`,
            )
        }
    }
}
