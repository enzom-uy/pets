import {
    Controller,
    Get,
    Param,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { BusinessService } from './business.service'
import { AuthGuard } from '@/auth/auth.guard'
import { Response } from 'express'

@Controller('business')
export class BusinessController {
    constructor(private readonly businessService: BusinessService) {}

    @Get('create')
    // @UseGuards(AuthGuard)
    createBusiness(
        @Query('user_id') userId: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!userId) {
            return res.status(400).json({
                error: 'user_id query parameter is required',
            })
        }

        if (userId.length !== 36) {
            return res.status(400).json({
                error: 'user_id must be a valid UUID',
            })
        }

        res.json({ userId: userId })
    }
}
