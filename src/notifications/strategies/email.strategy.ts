import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppConfigService } from '../../common/config/app-config.service';
import { NotificationStrategy } from './notification-strategy.interface';
import { ChannelResultDto } from '../dto/channel-result.dto';
import { User } from '../../users/entities/user.entity';
import { firstValueFrom } from 'rxjs';

const CHANNEL = 'email';

@Injectable()
export class EmailStrategy implements NotificationStrategy {
  private readonly logger = new Logger(EmailStrategy.name);
  private readonly emailUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
    ) {
        this.emailUrl = this.configService.getEmailApiUrl();
    }

  isEnabled(user: User): boolean {
      return user.preferences?.email && !!user.email;
  }
  async send(payload: { to: string; message: string }): Promise<ChannelResultDto> {
    const { to, message } = payload;

    try {
        const res = await firstValueFrom(
            this.httpService.post(this.emailUrl, {
                email: to,
                message,
            })
        );

        return {
            channel: CHANNEL,
            result: res.data,
        };
    } catch (err) {
        this.logger.error(`Email notification failed: ${err.message}`);
        return {
            channel: CHANNEL,
            error: err.message,
        };
    }
  }
}
