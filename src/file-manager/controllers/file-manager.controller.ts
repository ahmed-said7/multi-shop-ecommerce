import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileManagerService } from '../services/file-manager.service';
import { UploadFileResponseDto } from '../dtos/responses/upload-file-response.dto';

@Controller('file-manager')
export class FileManagerController {
  constructor(private fileManagerService: FileManagerService) {}

  //@UseGuards(JwtGuard)
  @Post('upload-photo/:id/:isSlider') // Corrected route definition
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Param('isSlider') isSlider: boolean,
    @Req() request: any,
  ): Promise<UploadFileResponseDto> {
    if (!file || !id || isSlider === undefined) { // Corrected condition for isSlider
      throw new BadRequestException('Missing required parameters: file, id, isSlider');
    }
   
    const fileLink = await this.fileManagerService.uploadFile(
      file,
      id,
      isSlider,
      request,
    );
    return { url: fileLink };
  }
}
