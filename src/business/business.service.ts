import { DATABASE_CONNECTION } from '@/db/db.module'
import {
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { and, eq, or, SQL } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from 'drizzle/schema'
import { PinoLogger } from 'nestjs-pino'
import { DatabaseError } from 'pg'
import { v4 as uuid } from 'uuid'

interface CreateBusinessParams {
    userId: string
    name: string
    logoUrl?: string
    description: string
    tx?: NodePgDatabase<typeof schema>
}

interface FindBusinessParams {
    name?: string
    id?: string
    ownerId?: string
    tx?: NodePgDatabase<typeof schema>
}

@Injectable()
export class BusinessService {
    constructor(
        @Inject(DATABASE_CONNECTION)
        private readonly db: NodePgDatabase<typeof schema>,
        private readonly logger: PinoLogger,
    ) {}

    async createBusiness({
        userId,
        name,
        logoUrl,
        description,
        tx,
    }: CreateBusinessParams) {
        const db = tx || this.db

        const [businessExists] = await this.findBusiness({
            name,
            ownerId: userId,
        })

        if (businessExists) {
            throw new ConflictException('Business already exists')
        }

        try {
            const businessId = uuid()
            const business: typeof schema.business.$inferInsert = {
                id: businessId,
                name,
                description,
                logoUrl: logoUrl ? logoUrl : undefined,
                ownerId: userId,
            }
            const createdBusiness = await db
                .insert(schema.business)
                .values(business)
                .returning()
            return createdBusiness[0]
        } catch (err) {
            const error = err as DatabaseError
            if (error.code === '23505') {
                throw new ConflictException(
                    'Business with this name already exists.',
                )
            }

            this.logger.error(
                `Error creating business for user ${userId}: ${error.message}`,
                error.stack,
            )
            throw new InternalServerErrorException(
                `Could not create business. Please try again later.`,
            )
        }
    }

    async findBusiness({ name, id, ownerId, tx }: FindBusinessParams) {
        const db = tx || this.db

        if (!name && !id && !ownerId) {
            return []
        }

        try {
            const conditions: SQL[] = []

            if (name) {
                conditions.push(eq(schema.business.name, name))
            }

            if (id) {
                conditions.push(eq(schema.business.id, id))
            }

            if (ownerId) {
                conditions.push(eq(schema.business.ownerId, ownerId))
            }

            const business = await db
                .select()
                .from(schema.business)
                .where(and(...conditions))
                .limit(1)

            return business
        } catch (err) {
            const error = err as Error
            this.logger.error(
                `Error finding business: ${error.message}`,
                error.stack,
            )

            throw new InternalServerErrorException(
                'Could not fetch business details.',
            )
        }
    }
}
