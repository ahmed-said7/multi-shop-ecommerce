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

import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { Types } from 'mongoose';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';

@Controller('product-slider')
export class ProductSliderController {
  constructor(private readonly productSliderService: ProductSliderService) {}

  @UseGuards(MerchantGuard)
  @Post()
  create(
    @Body() createProductSliderDto: CreateProductSliderDto,
    @MerchantUser() user: MerchantPayload,
  ) {
    return this.productSliderService.create(
      createProductSliderDto,
      user.shopId,
    );
  }

  @Get('shop/:id')
  findAll(@Param('id', ValidateObjectIdPipe) id: Types.ObjectId) {
    return this.productSliderService.findAll(new Types.ObjectId(id));
  }

  @Get('one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.productSliderService.findOne(id);
  }

  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateProductSliderDto: UpdateProductSliderDto,
  ) {
    return this.productSliderService.update(id, updateProductSliderDto);
  }

  @UseGuards(MerchantGuard)
  @Delete(':id')
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @MerchantUser() user: MerchantPayload,
  ) {
    return this.productSliderService.remove(id, user?.shopId);
  }
}
