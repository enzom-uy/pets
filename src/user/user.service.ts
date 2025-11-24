import { DATABASE_CONNECTION } from '@/db/db.module'
import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from 'drizzle/schema'

export type User = any

@Injectable()
export class UserService {
    constructor(
        @Inject(DATABASE_CONNECTION)
        private db: NodePgDatabase<typeof schema>,
    ) {}

    async findByEmail(email: string) {
        console.log('Email received in findByEmail: ', email)
        try {
            const [user] = await this.db
                .select()
                .from(schema.users)
                .where(eq(schema.users.email, email))
            return user || null
        } catch (error) {
            throw new InternalServerErrorException(
                `Error finding user by email: ${error}`,
            )
        }
    }

    // TODO: test this
    async createUser(
        user: typeof schema.users.$inferInsert,
        tx?: NodePgDatabase<typeof schema>,
    ) {
        const db = tx || this.db
        const userExists = await this.findByEmail(user.email)
        if (userExists) {
            throw new Error('User already exists')
        }
        try {
            const createdUser = await db
                .insert(schema.users)
                .values(user)
                .returning()

            return createdUser[0]
        } catch (error) {
            throw new InternalServerErrorException(
                `Error creating user: ${error}`,
            )
        }
    }
}
