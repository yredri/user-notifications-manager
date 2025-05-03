import { Injectable } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { ChannelResultDto } from "./dto/channel-result.dto";
import { NotificationResponseDto } from "./dto/notification-response.dto";
import { EmailStrategy } from "./strategies/email.strategy";
import { SmsStrategy } from "./strategies/sms.strategy";

@Injectable()
export class NotificationManager {
    constructor(
        private readonly emailStrategy: EmailStrategy,
        private readonly smsStrategy: SmsStrategy,
    ) {}

    async dispatchToUserChannels(user: User, message: string): Promise<NotificationResponseDto> {
        const { userId, email, telephone } = user;
        const strategies = [this.emailStrategy, this.smsStrategy];
        const results: ChannelResultDto[] = [];

        for(const strategy of strategies) {
            if(strategy.isEnabled(user)) {
                const res = await strategy.send({
                    to: strategy === this.emailStrategy ? email! : telephone!,
                    message,
                });
                results.push(res);
            }
        }

        return {
            userId,
            email,
            results,
        };
    }
}
