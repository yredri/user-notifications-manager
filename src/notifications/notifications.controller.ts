import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post('send')
    async send(@Body() dto: SendNotificationDto): Promise<NotificationResponseDto> {
        return await this.notificationsService.prepareUserNotification(dto);
    }
}
