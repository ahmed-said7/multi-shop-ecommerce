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
} from '@nestjs/common';
import { ProductSliderService } from './product-slider.service';
import { CreateProductSliderDto } from './dto/create-product-slider.dto';
import { UpdateProductSliderDto } from './dto/update-product-slider.dto';
import { Types } from 'mongoose';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { QueryProductSliderDto } from './dto/query-product-slider.dto';

@Controller('product-slider')
export class ProductSliderController {
  constructor(private readonly productSliderService: ProductSliderService) {}

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  create(
    @Body() createProductSliderDto: CreateProductSliderDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.productSliderService.create(
      createProductSliderDto,
      user.shopId
    );
  }

  @Get('shop/:id')
  findAll(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Query() query:QueryProductSliderDto
  ) {
    query.shopId=id;
    return this.productSliderService.findAll(query);
  }

  @Get('one/:id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.productSliderService.findOne(id);
  }

  
  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateProductSliderDto: UpdateProductSliderDto,
    @AuthUser() user:IAuthUser
  ) {
    return this.productSliderService.update(id,user.shopId ,updateProductSliderDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser
  ) {
    return this.productSliderService.remove(id, user?.shopId);
  }
}
