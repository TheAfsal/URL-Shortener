/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMagicLink(email: string, token: string) {
    console.log(email, token);
    const magicLink = `${process.env.FRONTEND_URL}/auth/magic/${token}`;
    await this.transporter.sendMail({
      from: `"URL Shortener" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Account with Magic Link',
      html: `
        <p>Hello,</p>
        <p>Click the link below to log in to your URL Shortener account:</p>
        <a href="${magicLink}">${magicLink}</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}
