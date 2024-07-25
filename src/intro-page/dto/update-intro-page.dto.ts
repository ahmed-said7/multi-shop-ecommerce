import { PartialType } from '@nestjs/mapped-types';
import { CreateIntroPageDto } from './create-intro-page.dto';
export class UpdateIntroPageDto extends PartialType(CreateIntroPageDto) {};
