import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import  { Types } from 'mongoose';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtGuard, MerchantGuard)
  @Post('')
  create(
    @Body('shopId') shopId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(shopId, createCategoryDto);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Get('/shop/:shopId')
  findAll(@Param('shopId') shopId: Types.ObjectId) {
    return this.categoryService.findAll(new Types.ObjectId(shopId));
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Body('shopId') shopId: string,
    @Body('userRole') userRole: string,
  ) {
    return this.categoryService.update(id, updateCategoryDto, shopId, userRole);
  }

  @UseGuards(JwtGuard, MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
