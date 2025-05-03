import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { AppConfigService } from "../config/app-config.service";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly configService: AppConfigService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const expectedToken = this.configService.getAuthToken();

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        const authToken = authHeader.split(' ')[1];

        if (authToken !== expectedToken) {
            throw new UnauthorizedException('Invalid Token');
        }

        next();
    }
}
