import { IsNotEmpty, IsArray } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { PhotoSlide } from 'src/photo-slide/schemas/photoSlide_schema';

export class CreatePhotoSliderDto {
  @IsArray({
    message: 'A PhotoSlider must have an array of photoSlides Objects',
  })
  photoSlides: PhotoSlide[];

  shop: string;
}
