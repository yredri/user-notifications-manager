import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

class NotificationPreferences {
    @IsOptional()
    email?: boolean;
  
    @IsOptional()
    sms?: boolean;
}

export class CreateUserDto {
    @IsEmail()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    telephone: string;
  
    @IsObject()
    @ValidateNested()
    @Type(() => NotificationPreferences)
    preferences: NotificationPreferences;
}