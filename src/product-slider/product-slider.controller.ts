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
import { ProductSliderService } from './product-slider.service';
import { CreateProductSliderDto } from './dto/create-product-slider.dto';
import { UpdateProductSliderDto } from './dto/update-product-slider.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('product-slider')
export class ProductSliderController {
  constructor(private readonly productSliderService: ProductSliderService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createProductSliderDto: CreateProductSliderDto,
    @Body('shopId') shopId: string,
  ) {
    return this.productSliderService.create(createProductSliderDto, shopId);
  }

  @Get('shop/:id')
  findAll(@Param('id') id: string) {
    return this.productSliderService.findAll(id);
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.productSliderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductSliderDto: UpdateProductSliderDto,
  ) {
    return this.productSliderService.update(id, updateProductSliderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSliderService.remove(id);
  }
}
