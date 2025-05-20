import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://task-management-admin:myX0qH4wj8dtrbl0@cluster0.0rpukw0.mongodb.net/url-shortener'),AuthModule, UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
