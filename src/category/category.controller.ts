import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles,  IAuthUser, optsImg } from 'src/common/enums';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { QueryCategoryDto } from './dto/query-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSingleFileInterceptor } from 'src/common/interceptors/upload-file.interceptor';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @UseInterceptors(FileInterceptor("image",optsImg),UploadSingleFileInterceptor)
  @Roles(AllRoles.MERCHANT)
  create(
    @AuthUser() user: IAuthUser,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(user.shopId, createCategoryDto);
  }

  @Get()
  findAll(
    @Query() query:QueryCategoryDto
  ) {
    return this.categoryService.findAll(query);
  }

  @Get('/one/:id')
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string
  ) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @UseInterceptors(FileInterceptor("image",optsImg),UploadSingleFileInterceptor)
  @Roles(AllRoles.MERCHANT)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.categoryService.update(id, user.shopId, updateCategoryDto);
  }

  
  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.categoryService.remove(id, user.shopId);
  }
}
