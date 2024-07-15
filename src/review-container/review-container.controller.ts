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
import { ReviewContainerService } from './review-container.service';
import { CreateReviewContainerDto } from './dto/create-reviewContainer.dto';
import { UpdateReviewContainerDto } from './dto/update-reviewContainer.dto';
import { Types } from 'mongoose';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { QueryReviewContainerDto } from './dto/query-review.dto';
import { Roles } from 'src/common/decorator/roles';

@Controller('review-container')
export class ReviewContainerController {
  constructor(private readonly reviewService: ReviewContainerService) {}
  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  create(
    @Body() createReviewDto: CreateReviewContainerDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.reviewService.create(createReviewDto, user.shopId);
  }

  @Get('/shop/:id')
  findAll(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Query() query:QueryReviewContainerDto
  ) {
    query.shopId=id;
    return this.reviewService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.reviewService.findOne(id);
  }
  
  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateReviewDto: UpdateReviewContainerDto,
    @AuthUser() user: IAuthUser,
  ) {
    return this.reviewService.update(id, user.shopId ,updateReviewDto);
  };

  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.reviewService.remove(id, user.shopId);
  };
};
