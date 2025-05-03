import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class SendNotificationDto {
    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsString()
    message: string;
}
