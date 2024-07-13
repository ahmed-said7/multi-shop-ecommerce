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
import { ReviewContainerService } from './review-container.service';
import { CreateReviewContainerDto } from './dto/create-reviewContainer.dto';
import { UpdateReviewContainerDto } from './dto/update-reviewContainer.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from 'src/user/schemas/user_schema';
import { Roles } from 'src/common/decorator/roles';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';

@Controller('review-container')
export class ReviewContainerController {
  constructor(private readonly reviewService: ReviewContainerService) {}
  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  create(
    @Body() createReviewDto: CreateReviewContainerDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.reviewService.create(createReviewDto, user.shopId);
  }

  @Get('/shop/:id')
  findAll(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.reviewService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.reviewService.findOne(id);
  }
  @UseGuards(MerchantGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateReviewDto: UpdateReviewContainerDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.reviewService.remove(id, user.shopId);
  }
}
