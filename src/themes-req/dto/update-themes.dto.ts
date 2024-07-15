import { PartialType } from "@nestjs/mapped-types";
import { CreateThemeDto } from "./create-themes.dto";

export class UpdateThemesDto extends PartialType(CreateThemeDto) {};