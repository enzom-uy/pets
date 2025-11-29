import {
    Body,
    Controller,
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
import { Error } from 'postgres'

@Controller('business')
export class BusinessController {
    constructor(private readonly businessService: BusinessService) {}

    @Post('create')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createBusiness(
        @Body() business: CreateBusinessDto,
        @Res() res: Response,
    ) {
        const createdBusiness =
            await this.businessService.createBusiness(business)
        return res.status(201).json(createdBusiness)
    }
}
