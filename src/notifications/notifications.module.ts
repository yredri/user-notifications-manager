import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppConfigModule } from '../common/config/app-config.module';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationManager } from './notification.manager';
import { EmailStrategy } from './strategies/email.strategy';
import { SmsStrategy } from './strategies/sms.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    AppConfigModule,
  ],
  providers: [
    NotificationsService,
    NotificationManager,
    EmailStrategy,
    SmsStrategy,
  ],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
