import { IsNotEmpty, IsArray } from "class-validator";
import mongoose, { Types } from "mongoose";

export class CreatePhotoSliderDto {
    @IsArray({ message: 'A CardSlider must have an array of card IDs' })
    photoSlides: mongoose.Types.ObjectId[];


    shop: string;
}
