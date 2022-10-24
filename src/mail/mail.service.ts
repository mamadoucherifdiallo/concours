import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

interface UserEntity {
  name: string;
  email: string;
  body: string;
  info: string;
}
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendInfos({ name, email, body, info }: UserEntity, token?: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Sama concours" <mamadoucherifd57@gmail.com>', // override default from
      subject: "INSCRIPTION SUR SAMA CONCOURS",
      template: "./module-registration", // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name,
        url,
        body,
        info,
      },
    });
  }

  async sendActivationEmail(
    { name, email, body, info }: UserEntity,
    subject?: string,
    url?: string
  ) {
    // const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Sama concours" <mamadoucherifd57@gmail.com>', // override default from
      subject: subject,
      template: "./account-activation", // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name,
        url,
        body,
        info,
      },
    });
  }

  async sendResetPasswordLink(
    { name, email, body, info }: UserEntity,
    url?: string
  ) {
    // const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      from: '"Sama concours" <mamadoucherifd57@gmail.com>', // override default from
      subject: "Mise à jour de mot de passe",
      template: "./reset-password", // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name,
        url,
        body,
        info,
      },
    });
  }
}
