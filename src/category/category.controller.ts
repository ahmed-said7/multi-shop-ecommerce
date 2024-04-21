import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtGuard)
  @Post('')
  create(
    @Body('userId') userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(userId, createCategoryDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Req() request: Request) {
    return this.categoryService.findAll(request);
  }

  @UseGuards(JwtGuard)
  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
