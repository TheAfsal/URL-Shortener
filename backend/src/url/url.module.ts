import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { Url, UrlSchema } from './schemas/url.schema';
import { AuthModule } from '../auth/auth.module';
import { RedirectController } from './redirect.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    AuthModule,
  ],
  controllers: [UrlController, RedirectController],
  providers: [UrlService],
})
export class UrlModule {}
