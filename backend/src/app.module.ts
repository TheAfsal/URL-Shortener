import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.DB_URL;
        console.log('Mongoose connecting to:', uri);
        if (!uri) {
          throw new Error('DB_URL environment variable is not set');
        }
        return {
          uri,
          retryAttempts: 3,
          retryDelay: 1000,
          ssl: true,
          authSource: 'admin',
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
        };
      },
    }),
    AuthModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
