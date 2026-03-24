import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Throttle } from '@nestjs/throttler';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Throttle({ analytics: { limit: 30, ttl: 60000 } })
    @Get(':shortCode')
    getStats(@Param('shortCode') shortCode: string) {
        return this.analyticsService.getStats(shortCode);
    }
}
