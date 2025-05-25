import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller()
export class RedirectController {
  constructor(private urlService: UrlService) {}

  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    console.log('Redirecting shortCode:', shortCode); // Debug log
    const longUrl = await this.urlService.redirect(shortCode);
    return { url: longUrl, statusCode: 302 };
  }
}
