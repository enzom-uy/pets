import {
    Body,
    Controller,
    Inject,
    Post,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { BusinessService } from './business.service'
import { AuthGuard } from '@/auth/auth.guard'
import { Response } from 'express'
import { CreateBusinessDto } from './dto/create-business.dto'
import { DATABASE_CONNECTION } from '@/db/db.module'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from 'drizzle/schema'

@Controller('business')
export class BusinessController {
    constructor(
        private readonly businessService: BusinessService,
        @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    ) {}

    @Post('create')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createBusiness(
        @Body() business: CreateBusinessDto,
        @Res() res: Response,
    ) {
        await this.db.transaction(async (tx) => {
            const createdBusiness = await this.businessService.createBusiness({
                tx,
                name: business.name,
                description: business.description,
                logoUrl: business.logoUrl,
                userId: business.userId,
            })
            return res.status(201).json(createdBusiness)
        })
    }
}
