export class User {
    userId: number;
    email: string;
    telephone?: string;
    preferences: {
        email: boolean;
        sms: boolean;
    }
}
