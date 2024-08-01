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
import { AdminRequestsService } from './admin-requests.service';
import { CreateAdminRequestDto } from './dto/create-admin-request.dto';
import { UpdateAdminRequestDto } from './dto/update-admin-request.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { QueryRequestDto } from './dto/query-request.dto';

@Controller('admin-requests')
export class AdminRequestsController {
  constructor(private readonly adminRequestsService: AdminRequestsService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.USER)
  create(@Body() body: CreateAdminRequestDto, @AuthUser() user: IAuthUser) {
    body.userId = user._id;
    return this.adminRequestsService.create(body);
  }

  @Get()
  findAll(@Query() query: QueryRequestDto) {
    return this.adminRequestsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.adminRequestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @AuthUser() user: IAuthUser,
    @Body() updateAdminRequestDto: UpdateAdminRequestDto,
  ) {
    updateAdminRequestDto.adminId = user._id;
    return this.adminRequestsService.update(id, updateAdminRequestDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(AllRoles.ADMIN, AllRoles.USER)
  remove(
    @AuthUser() user: IAuthUser,
    @Param('id', ValidateObjectIdPipe) reqId: string,
  ) {
    return this.adminRequestsService.remove(reqId, user);
  }
}
