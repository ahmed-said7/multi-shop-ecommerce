// import {
//   BadRequestException,
//   Controller,
//   Param,
//   Post,
//   Req,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { FileManagerService } from '../services/file-manager.service';
// import { UploadFileResponseDto } from '../dtos/responses/upload-file-response.dto';
// import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
// import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
// import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
// import { Roles } from 'src/common/decorator/roles';
// import { UserRole } from 'src/user/schemas/user_schema';

// @Controller('file-manager')
// export class FileManagerController {
//   constructor(private fileManagerService: FileManagerService) {}

//   @Post('upload-photo/:id/:isSlider')
//   @UseInterceptors(FileInterceptor('file'))
//   @UseGuards(AuthenticationGuard,AuthorizationGuard)
//   @Roles(UserRole.MERCHANT)
//   async uploadPhoto(
//     @UploadedFile() file: Express.Multer.File,
//     @Param('id', ValidateObjectIdPipe) id: string,
//     @Param('isSlider') isSlider: boolean,
//     @Req() request: any,
//   ): Promise<UploadFileResponseDto> {
//     if (!file || !id || isSlider === undefined) {
//       throw new BadRequestException(
//         'Missing required parameters: file, id, isSlider',
//       );
//     }

//     const fileLink = await this.fileManagerService.uploadFile(
//       file,
//       id,
//       isSlider,
//       request,
//     );
//     return { url: fileLink };
//   }
// }
