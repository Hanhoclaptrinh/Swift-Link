import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get(':shortCode')
    getStats(@Param('shortCode') shortCode: string) {
        return this.analyticsService.getStats(shortCode);
    }
}
