import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Url extends Document {
    @Prop({ required: true })
    longUrl: string;

    @Prop({ required: true, unique: true })
    shortCode: string;

    @Prop({ required: true })
    userId: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);