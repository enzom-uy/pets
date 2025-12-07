import { Module } from '@nestjs/common'
import { BranchService } from './branch.service'
import { BranchController } from './branch.controller'
import { BusinessService } from '@/business/business.service'

@Module({
    imports: [],
    controllers: [BranchController],
    providers: [BranchService, BusinessService],
})
export class BranchModule {}
