import { BusinessService } from '@/business/business.service'
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

interface CreateBranchProps {
    branchName: string
    branchDescription?: string
    businessId: string
    city: string
    address: string
    services: string[]
    tx?: NodePgDatabase<typeof schema>
}

@Injectable()
export class BranchService {
    constructor(
        @Inject(DATABASE_CONNECTION)
        private readonly db: NodePgDatabase<typeof schema>,
        private readonly businessService: BusinessService,
        private readonly logger: PinoLogger,
    ) {}

    async createBranch({
        branchName,
        branchDescription,
        businessId,
        city,
        address,
        services,
        tx,
    }: CreateBranchProps) {
        const db = tx || this.db
        const businessExists = await this.businessService.findBusiness({
            id: businessId,
        })

        if (!businessExists) {
            throw new Error(`There is no bussines with id ${businessId}.`)
        }

        try {
            const branchValues: typeof schema.branches.$inferInsert = {
                businessId,
                name: branchName,
                description: branchDescription,
                city,
                address,
            }
            const createdBranch = await db
                .insert(schema.branches)
                .values(branchValues)
                .returning()
            return createdBranch[0]
        } catch (err) {
            const error = err as DatabaseError
            if (error.code === '23505') {
                throw new ConflictException(
                    `Branch with name ${branchName} already exists.`,
                )
            }

            this.logger.error(
                `Error creating branch ${branchName}: ${error.message}`,
                error.stack,
            )

            throw new InternalServerErrorException(
                `Could not create branch. Please try again later.`,
            )
        }
    }
}
