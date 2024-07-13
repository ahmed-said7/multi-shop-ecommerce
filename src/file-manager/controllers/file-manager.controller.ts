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
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';

@Controller('file-manager')
export class FileManagerController {
  constructor(private fileManagerService: FileManagerService) {}

  @UseGuards(MerchantGuard)
  @Post('upload-photo/:id/:isSlider')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Param('isSlider') isSlider: boolean,
    @Req() request: any,
  ): Promise<UploadFileResponseDto> {
    if (!file || !id || isSlider === undefined) {
      throw new BadRequestException(
        'Missing required parameters: file, id, isSlider',
      );
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
