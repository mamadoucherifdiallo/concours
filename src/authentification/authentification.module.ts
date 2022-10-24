import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./auth.strategy";
import { AuthentificationController } from "./authentification.controller";
import { AuthentificationService } from "./authentification.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthentificationController],
  providers: [AuthentificationService, JwtStrategy],
})
export class AuthentificationModule {}
