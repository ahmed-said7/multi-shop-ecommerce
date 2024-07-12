import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Client, LibraryResponse, SendEmailV3_1 } from 'node-mailjet';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  async sendEmail(to: string, name: string, code: number | string) {
    return await this.emailHandler(to, name, code);
  }

  private async emailHandler(to: string, name: string, code: number | string) {
    const key = this.configService.get<string>('MAIL_KEY');
    const secretKey = this.configService.get<string>('MAIL_SECRET_KEY');

    const mailjet = new Client({
      apiKey: key,
      apiSecret: secretKey,
    });
    const self=this;
    const data: SendEmailV3_1.Body = {
      Messages: [
        {
          From: {
            Email: self.configService.get("Email"),
            Name: self.configService.get("Name") 
          },
          To: [
            {
              Email: to,
              Name: name,
            },
          ],
          Subject: `OTP Code`,
          TextPart: `Code Is ${code}`,
        },
      ],
    };

    try {
      const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

      return result.body;
    } catch (error) {
      throw new InternalServerErrorException(error, "Can't Send The Email");
    }
  }

  async emailOTPCode(to: string, name: string) {
    const { otp : otpCode } = await this.otpService.createOtp();

    return await this.sendEmail(to, name, otpCode);
  }
}
