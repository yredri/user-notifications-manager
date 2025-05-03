import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  getEmailApiUrl(): string {
    return this.configService.getOrThrow('EMAIL_API_URL');
  }

  getSmsApiUrl(): string {
    return this.configService.getOrThrow('SMS_API_URL');
  }

  getAuthToken(): string {
    return this.configService.getOrThrow('AUTH_TOKEN');
  }

  getPort(): number {
    return Number(this.configService.get('PORT')) || 8080;
  }
}
