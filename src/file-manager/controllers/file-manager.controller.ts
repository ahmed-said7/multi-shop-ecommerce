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
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('file-manager')
export class FileManagerController {
  constructor(private fileManagerService: FileManagerService) {}

  @UseGuards(JwtGuard)
  @Post('upload-photo/:id/is-slider')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Param('isSlider') isSlider: boolean,
    @Req() request: any,
  ): Promise<UploadFileResponseDto> {
    if (!file && !id && !isSlider) {
      throw new BadRequestException()
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
