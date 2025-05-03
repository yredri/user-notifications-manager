import { Type } from 'class-transformer';
import { IsEmail, IsBoolean, IsObject, ValidateNested, IsOptional } from 'class-validator';

class NotificationPreferencesUpdate {
    @IsBoolean()
    email: boolean;
  
    @IsBoolean()
    sms: boolean;
}

export class UpdatePreferencesDto {
  @IsEmail()
  email: string;

  @IsObject()
  @ValidateNested()
  @Type(() => NotificationPreferencesUpdate)
  preferences: NotificationPreferencesUpdate;
}
