import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoSliderDto } from './create-photo-slider.dto';
import { IsArray } from 'class-validator';
import mongoose from 'mongoose';

export class UpdatePhotoSliderDto extends PartialType(CreatePhotoSliderDto) {

    @IsArray({ message: 'A CardSlider must have an array of card IDs' })
    photoSlides: mongoose.Types.ObjectId[];
}
