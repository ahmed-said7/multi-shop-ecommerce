import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoSliderDto } from './create-photo-slider.dto';
import { IsArray } from 'class-validator';
import mongoose from 'mongoose';
import { PhotoSlide } from 'src/photo-slide/schemas/photoSlide_schema';

export class UpdatePhotoSliderDto extends PartialType(CreatePhotoSliderDto) {
  @IsArray({
    message: 'A PhotoSlider must have an array of photoSlides Objects',
  })
  photoSlides: PhotoSlide[];
}
