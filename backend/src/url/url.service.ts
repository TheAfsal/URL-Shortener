import { Injectable, UnauthorizedException } from '@nestjs/common';
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
}