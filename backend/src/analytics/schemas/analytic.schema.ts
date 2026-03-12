import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: true })
export class Analytics {
    @Prop({ required: true, index: true })
    shortCode: string;

    @Prop()
    ip: string;

    @Prop()
    userAgent: string;

    @Prop()
    referrer: string;

    @Prop()
    country: string;
}

export const AnalyticSchema = SchemaFactory.createForClass(Analytics);