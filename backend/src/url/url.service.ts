/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './schemas/url.schema';
import { AuthService } from '../auth/auth.service';
import * as shortid from 'shortid';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    private authService: AuthService,
  ) {}

  async shortenUrl(longUrl: string, userEmail: string): Promise<Url> {
    const user = await this.authService.validateUser(userEmail);
    if (!user) throw new UnauthorizedException('User not found');
    const shortCode = shortid.generate();
    const url = new this.urlModel({ longUrl, shortCode, userId: user._id });
    return url.save();
  }

  async getUrls(userEmail: string): Promise<Url[]> {
    const user = await this.authService.validateUser(userEmail);
    if (!user) throw new UnauthorizedException('User not found');
    return this.urlModel.find({ userId: user._id }).exec();
  }

  async redirect(shortCode: string): Promise<string> {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) throw new UnauthorizedException('URL not found');
    return url.longUrl;
  }

  async deleteUrl(
    shortCode: string,
    userEmail: string,
  ): Promise<{ message: string }> {
    console.log(shortCode);
    console.log(userEmail);

    const user = await this.authService.validateUser(userEmail);
    if (!user) throw new UnauthorizedException('User not found');
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) throw new NotFoundException('URL not found');
    if (url.userId.toString() !== (user as { _id: string })._id.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to delete this URL',
      );
    }

    await this.urlModel.deleteOne({ shortCode });

    return { message: 'URL deleted successfully' };
  }
}
