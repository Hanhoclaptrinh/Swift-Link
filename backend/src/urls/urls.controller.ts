import { Body, Controller, Param, Get, Post, Res, Req } from '@nestjs/common';
import { UrlsService } from './urls.service';
import type { Request, Response } from 'express';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
export class UrlsController {
    constructor(
        private readonly urlsService: UrlsService
    ) { }

    @Post('urls/shorten')
    create(@Body() body: CreateUrlDto) {
        return this.urlsService.shortenUrl(body);
    }

    @Get(':shortCode')
    async redirect(
        @Param('shortCode') shortCode: string,
        @Res() res: Response,
        @Req() req: Request
    ) {
        const originalUrl = await this.urlsService.handleRedirect(shortCode, req);

        if (!originalUrl) return res.status(404).send('Link not found');

        res.redirect(originalUrl);
    }
}
