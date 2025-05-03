import { User } from '../../users/entities/user.entity';
import { ChannelResultDto } from '../dto/channel-result.dto';

export interface NotificationStrategy {
    send(payload: { to: string; message: string; }): Promise<ChannelResultDto>;
    isEnabled(user: User): boolean;
}
