import {
    IsArray,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    MinLength,
} from 'class-validator'

export class CreateBusinessDto {
    // Business data
    @IsUUID()
    userId: string
    @IsString()
    @MinLength(4, { message: 'Business name must have at least 4 characters.' })
    name: string
    @IsString()
    @MinLength(10, {
        message: 'Business description must have at least 10 characters.',
    })
    description: string
    @IsOptional()
    @IsUrl()
    logoUrl: string

    // Business's branch data
    @IsString()
    @MinLength(4, { message: 'Branch name must have at least 4 characters.' })
    branchName: string
    @IsString()
    @IsOptional()
    branchDescription: string
    @IsString()
    city: string
    @IsString()
    address: string
    @IsArray()
    services: string[]
}
