import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppConfigService } from '../../common/config/app-config.service';
import { NotificationStrategy } from './notification-strategy.interface';
import { ChannelResultDto } from '../dto/channel-result.dto';
import { User } from '../../users/entities/user.entity';
import { firstValueFrom } from 'rxjs';

const CHANNEL = 'sms';

@Injectable()
export class SmsStrategy implements NotificationStrategy {
  private readonly logger = new Logger(SmsStrategy.name);
  private readonly smsUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
) {
    this.smsUrl = this.configService.getSmsApiUrl();
}

  isEnabled(user: User): boolean {
      return user.preferences?.sms && !!user.telephone;
  }
  async send(payload: { to: string; message: string }): Promise<ChannelResultDto> {
    const { to, message } = payload;

    try {
        const res = await firstValueFrom(
            this.httpService.post(this.smsUrl, {
                telephone: to,
                message: message,
            })
        );

        return {
            channel: CHANNEL,
            result: res.data,
        };
    } catch (err) {
        this.logger.error(`SMS notification failed: ${err.message}`);
        return {
            channel: CHANNEL,
            error: err.message,
        };
    }
  }
}
