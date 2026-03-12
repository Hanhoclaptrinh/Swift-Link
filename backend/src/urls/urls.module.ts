import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schemas/url.schema';
import { RedisModule } from 'src/redis/redis.module';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Url.name, schema: UrlSchema }
    ]),
    RedisModule,
    AnalyticsModule
  ],
  controllers: [UrlsController],
  providers: [UrlsService]
})
export class UrlsModule { }
