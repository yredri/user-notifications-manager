export class ChannelResultDto {
    channel: string;
    result?: {
        status: string;
        channel: string;
        to: string;
        message: string;
    };
    error?: string;
}
