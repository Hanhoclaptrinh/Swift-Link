import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Analytics, AnalyticsDocument } from './schemas/analytic.schema';
import { Model } from 'mongoose';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectModel(Analytics.name)
        private analyticModel: Model<AnalyticsDocument>
    ) { }
    async logClick(data: {
        shortCode: string,
        ip?: string,
        userAgent: string,
        referrer?: string
    }) {
        await this.analyticModel.create({
            shortCode: data.shortCode,
            ip: data.ip,
            userAgent: data.userAgent,
            referrer: data.referrer
        });
    }
}
