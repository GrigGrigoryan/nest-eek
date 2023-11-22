import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { SendMailDto } from './dto/send-mail.dto';
import { BadRequest } from '../errors/BadRequest';
import { InternalServerError } from '../errors/InternalServerError';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly from: string;
  constructor(private readonly configService: ConfigService) {
    this.from = configService.get<string>('mail.from');
    sgMail.setApiKey(configService.get<string>('mail.apiKey'));
  }

  async sendEmail(sendMailDto: SendMailDto) {
    const msg = {
      ...sendMailDto,
      from: this.from,
    };

    try {
      await sgMail.send(msg);
      this.logger.verbose(`Email sent successfully to: ${sendMailDto.to}`);
    } catch (error) {
      if (error?.['response']) {
        const errorMessage = error?.['response']?.body?.errors[0]?.message;
        this.logger.error(`Error sending email: ${errorMessage}`);
        throw new BadRequest(`Error sending email: ${errorMessage}`);
      } else {
        throw new InternalServerError('email_send_error');
      }
    }
  }
}
