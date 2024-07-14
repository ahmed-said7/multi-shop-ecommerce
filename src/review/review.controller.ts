import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from 'src/user/schemas/user_schema';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';
import { QueryReviewDto } from './dto/query-review.dto';


@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService
  ) {};

  @Post()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  create(
    @AuthUser() user:IAuthUser,
    @Body() body: CreateReviewDto
  ) {
    body.user=user._id;
    return this.reviewService.create(body);
  }

  @Get()
  findAll(
    @Query() query:QueryReviewDto,
  ) {
    return this.reviewService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @AuthUser() user:IAuthUser,
  ) {
    return this.reviewService.update(id, user,updateReviewDto);
  }

  @Delete(':id/:user')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  remove(
    @AuthUser() user:IAuthUser,
    @Param('id', ValidateObjectIdPipe) id: string
  ) {
    return this.reviewService.remove(id, user);
  }
}
