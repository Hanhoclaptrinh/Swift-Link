import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema({ timestamps: true })
export class Url {
    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    userId?: Types.ObjectId;

    @Prop({ required: true, unique: true })
    shortCode: string;

    @Prop({ required: true })
    originalUrl: string;

    @Prop({ default: 0 })
    clicks: number;
}

export const UrlSchema = SchemaFactory.createForClass(Url);