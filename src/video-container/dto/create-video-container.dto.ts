import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateVideoContainerDto {
  // @IsNotEmpty({message:i18nValidationMessage("validation.videoContainer.link.isNotEmpty")})
  @IsString({message:i18nValidationMessage("validation.videoContainer.link.isString")})
  link: string;
}
