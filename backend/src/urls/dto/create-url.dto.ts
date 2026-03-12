import { IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

export class CreateUrlDto {
    @IsUrl(
        { require_protocol: true },
        { message: 'URL must be valid and include http/https' }
    )
    originalUrl: string;

    @IsOptional()
    @IsString()
    @Length(3, 20, { message: 'Short code must be between 3 and 20 characters' })
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Short code only allows letters, numbers, - and _'
    })
    shortCode?: string;
}