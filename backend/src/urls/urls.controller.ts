import { Body, Controller, Param, Get, Post, Res, Req, NotFoundException } from '@nestjs/common';
import { UrlsService } from './urls.service';
import type { Request, Response } from 'express';
import { CreateUrlDto } from './dto/create-url.dto';
import { SkipThrottle } from '@nestjs/throttler';

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
    @SkipThrottle()
    async redirect(
        @Param('shortCode') shortCode: string,
        @Res() res: Response,
        @Req() req: Request
    ) {
        const originalUrl = await this.urlsService.handleRedirect(shortCode, req);

        if (!originalUrl) return res.status(404).send('Link not found');

        res.redirect(originalUrl);
    }

    @Get(':code/qr')
    async generateQr(@Param('code') code: string) {
        await this.urlsService.findByCode(code);

        return this.urlsService.generateQr(code);
    }
}
