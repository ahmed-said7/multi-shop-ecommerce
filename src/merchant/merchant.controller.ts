import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/createMerchant.dto';
import { UpdateMerchantDto } from './dto/updateMerchant.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { Roles } from 'src/common/decorator/roles';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { LoginMerchantDto } from './dto/loginMerchant.dt';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  create(@Body() data: CreateMerchantDto) {
    return this.merchantService.create(data);
  }

  @Post('login')
  login( @Body() body:LoginMerchantDto ) {
    return this.merchantService.merchantSignIn(body.email, body.password);
  }

  @Get()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.ADMIN)
  findAll( @Query('page') page?: string ) {
    return this.merchantService.findAll(page);
  }

  @Get("logged")
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  findMe( @AuthUser() merchant : IAuthUser ) {
    return this.merchantService.findOne(merchant._id);
  };

  @Get(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.ADMIN,AllRoles.MERCHANT)
  findOne(@Param('id', ValidateObjectIdPipe) merchntId: string) {
    return this.merchantService.findOne(merchntId);
  };

  @Patch()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  update(
    @AuthUser() user :  IAuthUser,
    @Body() data: UpdateMerchantDto,
  ) {
    return this.merchantService.update(user._id, data);
  }

  @Delete()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  delete(@AuthUser() user :  IAuthUser ) {
    return this.merchantService.delete(user._id);
  }
}
