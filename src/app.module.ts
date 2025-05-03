import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { AppConfigModule } from './common/config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    NotificationsModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
