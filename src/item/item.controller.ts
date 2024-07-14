import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';
import { Roles } from 'src/common/decorator/roles';
import { QueryItemDto } from './dto/query-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService
    // private readonly uploadService: UploadService,
  ) {}

  // private readonly logger = new Logger(ItemController.name);

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFiles() files: Express.Multer.File[],
    @AuthUser() user: IAuthUser,
  ) {
    // const imageUrls = await this.uploadService.uploadFiles(files);
    // createItemDto.images = imageUrls;
    return this.itemService.create(createItemDto, user.shopId);
  }

  @Get('all-items/:shop')
  findAll(
    @Param('shop',ValidateObjectIdPipe) shopId: string,
    @Query() query:QueryItemDto
  ) {
    query.shopId=shopId;
    return this.itemService.findAll(
      query
    );
  }

  @Get('one-item/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.itemService.findOne(id);
  }

  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
    @AuthUser() user:IAuthUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // const imageUrls = await this.uploadService.uploadFiles(files);

    // updateItemDto.images = imageUrls;

    return this.itemService.update(id,user.shopId,updateItemDto);
  }

  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  @Delete(':id')
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user:IAuthUser
  ) {
    return this.itemService.remove(id,user.shopId);
  }
}
