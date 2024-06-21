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
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { Types } from 'mongoose';

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
  findAll(@Param('id') id: Types.ObjectId) {
    return this.productSliderService.findAll(new Types.ObjectId(id));
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.productSliderService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductSliderDto: UpdateProductSliderDto,
  ) {
    return this.productSliderService.update(id, updateProductSliderDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Body('shopId') shopId: string) {
    return this.productSliderService.remove(id, shopId);
  }
}
