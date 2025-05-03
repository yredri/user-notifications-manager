import { ChannelResultDto } from "./channel-result.dto";

export class NotificationResponseDto {
    userId: number;
    email: string;
    results: ChannelResultDto[];
}
