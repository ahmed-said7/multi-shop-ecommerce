import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoSliderDto } from './create-photo-slider.dto';

export class UpdatePhotoSliderDto extends PartialType(CreatePhotoSliderDto) {};
