import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotificationManager } from './notification.manager';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    
    constructor(
        private readonly usersService: UsersService,
        private readonly notificationManager: NotificationManager,
    ) {}

    async prepareUserNotification(dto: SendNotificationDto): Promise<NotificationResponseDto> {
        let user;
        try {
            if(dto.userId) {
                user = await this.usersService.findOne(dto.userId);
            } else if(dto.email) {
                user = await this.usersService.findByEmail(dto.email);
            } else {
                throw new Error('Either userId or email must be provided');
            }
        } catch (error) {
            this.logger.error(`Error finding user: ${error.message}`);
            throw error;
        }

        return this.notificationManager.dispatchToUserChannels(user, dto.message);
    }
}
