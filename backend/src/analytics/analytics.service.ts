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

    async getTotalClicks(shortCode: string) {
        return await this.analyticModel.countDocuments({ shortCode });
    }

    async getTodayClicks(shortCode: string) {
        const todayVN = this.getStartOfTodayVN();

        todayVN.setHours(0, 0, 0, 0);

        return this.analyticModel.countDocuments({
            shortCode,
            createdAt: { $gte: todayVN }
        });
    }

    async getStats(shortCode: string) {
        const todayVN = this.getStartOfTodayVN();

        const [totalClicks, todayClicks] = await Promise.all([
            this.analyticModel.countDocuments({ shortCode }),
            this.analyticModel.countDocuments({
                shortCode,
                createdAt: { $gte: todayVN }
            })
        ]);

        return {
            totalClicks,
            todayClicks
        };
    }

    private getStartOfTodayVN() {
        const now = new Date();

        const todayVN = new Date(
            now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
        );

        todayVN.setHours(0, 0, 0, 0);

        return todayVN;
    }
}
