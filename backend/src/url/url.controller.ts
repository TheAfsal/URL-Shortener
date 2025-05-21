import { Controller, Post, Get, Body, Param, Request, UseGuards, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('url')
export class UrlController {
    constructor(private urlService: UrlService) {}

    @UseGuards(JwtAuthGuard)
    @Post('shorten')
    async shorten(@Body('longUrl') longUrl: string, @Request() req) {
        return this.urlService.shortenUrl(longUrl, req.user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-urls')
    async getUrls(@Request() req) {
        return this.urlService.getUrls(req.user.email);
    }

    @Get(':shortCode')
    @Redirect()
    async redirect(@Param('shortCode') shortCode: string) {
        const longUrl = await this.urlService.redirect(shortCode);
        return { url: longUrl, statusCode: 302 };
    }
}