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
        const sevenDaysAgo = new Date(todayVN);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [totalClicks, todayClicks, dailyStats, topReferrers, topBrowsers] = await Promise.all([
            this.analyticModel.countDocuments({ shortCode }),
            this.analyticModel.countDocuments({
                shortCode,
                createdAt: { $gte: todayVN }
            }),

            this.analyticModel.aggregate([
                {
                    $match: {
                        shortCode,
                        createdAt: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } }
            ]),
            // Top Referrers
            this.analyticModel.aggregate([
                { $match: { shortCode } },
                {
                    $group: {
                        _id: "$referrer",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),

            this.analyticModel.aggregate([
                { $match: { shortCode } },
                {
                    $group: {
                        _id: "$userAgent",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        ]);

        return {
            totalClicks,
            todayClicks,
            dailyStats: dailyStats.map(stat => ({ date: stat._id, clicks: stat.count })),
            topReferrers: topReferrers.map(ref => ({ name: ref._id || 'Direct', count: ref.count })),
            topBrowsers: topBrowsers.map(ua => ({ name: this.parseBrowser(ua._id), count: ua.count }))
        };
    }

    private parseBrowser(ua: string) {
        if (!ua) return 'Other';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('Postman')) return 'Postman';
        return 'Other';
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
