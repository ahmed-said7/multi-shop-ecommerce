import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotoSliderDto } from './create-photo-slider.dto';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdatePhotoSliderDto extends PartialType(CreatePhotoSliderDto) {
    @IsString({ message: "must be a string" })
    title: string;
    @IsString({ message: "must be a string" })
    subTitle: string;
    @IsString()
    titleAndSubTitlePostion: string;
    @IsString({ message: "must be a string" })
    titleAndSubTitleColor: string;
    @IsString({ message: "must be a string" })
    buttonText: string;
    @IsString({ message: "must be a string" })
    buttonLink: string;
    @IsString({ message: "must be a string" })
    buttonColor: string;
    @IsString({ message: "must be a string" })
    buttonTextColor: string;
    @IsString()
    buttonPosition: string;
    @IsString({ message: "must be a string" })
    photo: string;
    @IsBoolean({ message: "must be a bool" })
    isContainer: boolean = false;
    @IsBoolean({ message: "must be a bool" })
    isSlider: boolean = false;

}
