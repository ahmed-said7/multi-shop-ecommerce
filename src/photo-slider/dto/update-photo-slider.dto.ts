import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoSliderDto, PhotoSlides } from './create-photo-slider.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePhotoSliderDto extends PartialType(CreatePhotoSliderDto) {
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(()=>PhotoSlides)
    photoSlides: {
        title: string;
        subTitle: string;
        titleAndSubTitlePostion: string;
        titleAndSubTitleColor: string;
        buttonText: string;
        buttonLink: string;
        buttonColor: string;
        buttonTextColor: string;
        buttonPosition: string;
        photo: string;
    }[];
    shopId?: string;
}
