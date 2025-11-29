import { IsOptional, IsString, IsUrl, IsUUID, MinLength } from 'class-validator'

export class CreateBusinessDto {
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
}
