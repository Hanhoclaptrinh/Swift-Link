import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import { Url, UrlDocument } from './schemas/url.schema';
import { Model } from 'mongoose';
import { CreateUrlDto } from './dto/create-url.dto';
import { RedisService } from 'src/redis/redis.service';
import { AnalyticsService } from 'src/analytics/analytics.service';
import type { Request } from 'express';

@Injectable()
export class UrlsService {
    constructor(
        @InjectModel(Url.name)
        private urlModel: Model<UrlDocument>,
        private redis: RedisService,
        private analyticsService: AnalyticsService
    ) { }

    async shortenUrl(dto: CreateUrlDto) {
        let { originalUrl, shortCode } = dto;

        // user khong nhap shortcode -> tu tao bang nanoid
        if (!shortCode) {
            shortCode = nanoid(8);
        }

        // check trung shortcode
        const existCode = await this.urlModel.findOne({ shortCode });

        if (existCode) throw new ConflictException('Short code already exists');

        // luu url va shortcode
        const url = await this.urlModel.create({
            shortCode,
            originalUrl
        });

        return url;
    }

    async findByCode(shortCode: string) {
        const cacheKey = `url:${shortCode}`

        // check redis
        const cached = await this.redis.get(cacheKey);

        if (cached) {
            return { originalUrl: cached };
        }

        // query db
        const url = await this.urlModel.findOne({ shortCode }).lean();

        if (!url) return null;

        // cache redis
        await this.redis.set(cacheKey, url.originalUrl, 'EX', 3600);

        return url;
    }

    async handleRedirect(shortCode: string, req: Request) {
        const url = await this.findByCode(shortCode);

        if (!url) return null;

        await this.urlModel.updateOne(
            { shortCode },
            { $inc: { clicks: 1 } }
        );

        this.analyticsService.logClick({
            shortCode,
            ip: req.ip,
            userAgent: req.headers['user-agent'] as string,
            referrer: req.headers['referer'] as string
        });

        return url.originalUrl;
    }
}
