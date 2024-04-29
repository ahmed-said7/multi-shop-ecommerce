import { IsNotEmpty, IsArray } from "class-validator";
import mongoose, { Types } from "mongoose";

export class CreatePhotoSliderDto {
    @IsArray({ message: 'A PhotoSlider must have an array of photoSlides IDs' })
    photoSlides: mongoose.Types.ObjectId[];


    shop: string;
}
