import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationsService } from './notifications.service';
import { NotificationManager } from './notification.manager';
import { UsersService } from '../users/users.service';
import { EmailStrategy } from './strategies/email.strategy';
import { SmsStrategy } from './strategies/sms.strategy';
import { SendNotificationDto } from './dto/send-notification.dto';
import { AppConfigService } from '../common/config/app-config.service';

const mockUsersService = {
  findOne: jest.fn(),
  findByEmail: jest.fn(),
};

const mockNotificationManager = {
  dispatchToUserChannels: jest.fn(),
};

const mockAppConfigService = {
  getEmailApiUrl: jest.fn(() => 'http://localhost:5001/send-email'),
  getSmsApiUrl: jest.fn(() => 'http://localhost:5001/send-sms'),
  getAuthToken: jest.fn(() => 'onlyvim2024'),
};

describe('NotificationsService', () => {
  let service: NotificationsService;
  let usersService: UsersService;
  let notificationManager: NotificationManager;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        NotificationsService,
        EmailStrategy,
        SmsStrategy,
        { provide: NotificationManager, useValue: mockNotificationManager },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AppConfigService, useValue: mockAppConfigService,},
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    usersService = module.get<UsersService>(UsersService);
    notificationManager = module.get<NotificationManager>(NotificationManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('notifyUser', () => {
    const mockUser = {
      userId: 1,
      email: 'ironman@avengers.com',
      telephone: '+123456789',
      preferences: { email: true, sms: true },
    };

    const newMockUser = {
      userId: 5,
      email: 'mostyanir2@gmail.com',
      telephone: '+123456789',
      preferences: { email: true, sms: false },
    };

    const message = 'This is your notification';

    it('should send notification by userId', async () => {
      const dto: SendNotificationDto = { userId: 1, message };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockNotificationManager.dispatchToUserChannels.mockResolvedValue({ success: true });

      const result = await service.prepareUserNotification(dto);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(notificationManager.dispatchToUserChannels).toHaveBeenCalledWith(mockUser, message);
      expect(result).toEqual({ success: true });
    });

    it('should send notification by email', async () => {
      const dto: SendNotificationDto = { email: mockUser.email, message };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockNotificationManager.dispatchToUserChannels.mockResolvedValue({ success: true });

      const result = await service.prepareUserNotification(dto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(notificationManager.dispatchToUserChannels).toHaveBeenCalledWith(mockUser, message);
      expect(result).toEqual({ success: true });
    });

    it('should throw if neither userId nor email is provided', async () => {
      const dto: SendNotificationDto = { message };

      await expect(service.prepareUserNotification(dto)).rejects.toThrow('Either userId or email must be provided');
      expect(usersService.findOne).not.toHaveBeenCalledWith(dto);
      expect(usersService.findByEmail).not.toHaveBeenCalledWith(dto);
    });

    it('should throw an error from findOne', async () => {
      const dto: SendNotificationDto = { userId: 5, message };
      const error = new NotFoundException('User not found');

      mockUsersService.findOne.mockRejectedValue(error);

      await expect(service.prepareUserNotification(dto)).rejects.toThrow(error);
    });

    it('should throw an error from findByEmail', async () => {
      const dto: SendNotificationDto = { email: newMockUser.email, message };
      const error = new NotFoundException('User not found');

      mockUsersService.findByEmail.mockRejectedValue(error);

      await expect(service.prepareUserNotification(dto)).rejects.toThrow(error);
    });
  });
});
