import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from '../common/config/app-config.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationManager } from './notification.manager';
import { UsersService } from '../users/users.service';
import { EmailStrategy } from './strategies/email.strategy';
import { SmsStrategy } from './strategies/sms.strategy';
import { HttpModule } from '@nestjs/axios';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        HttpModule,
      ],
      controllers: [NotificationsController],
      providers: [
        NotificationsService,
        NotificationManager,
        EmailStrategy,
        SmsStrategy,
        UsersService,
        AppConfigService,
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
