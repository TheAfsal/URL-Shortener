import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    await this.authService.register(body.email, body.password);
    return {
      message:
        'Registration successful! Check your email for a link to log in.',
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('magic/:token')
  async verifyMagicLink(@Param('token') token: string) {
    return this.authService.verifyMagicLink(token);
  }
}
