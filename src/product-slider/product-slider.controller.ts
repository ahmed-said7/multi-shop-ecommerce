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
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';

@Controller('product-slider')
export class ProductSliderController {
  constructor(private readonly productSliderService: ProductSliderService) {}

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  create(
    @Body() createProductSliderDto: CreateProductSliderDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.productSliderService.create(
      createProductSliderDto,
      user.shopId,
    );
  }

  @Get('shop/:id')
  findAll(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.productSliderService.findAll(id);
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

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.productSliderService.remove(id, user?.shopId);
  }
}
