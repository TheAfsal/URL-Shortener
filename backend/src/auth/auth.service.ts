/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(email: string, password: string): Promise<void> {
    console.log(email, password);

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await user.save();

    const token = this.jwtService.sign({ email }, { expiresIn: '15m' });
    await this.emailService.sendMagicLink(email, token);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.isVerified) throw new UnauthorizedException('User not verified');

    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async verifyMagicLink(token: string): Promise<{ accessToken: string }> {
    try {
      const { email } = this.jwtService.verify(token);
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      user.isVerified = true;
      await user.save();

      const payload = { email: user.email };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
