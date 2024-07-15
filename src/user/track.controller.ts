import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TrackService } from './track.service';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';

@Controller('user/track')
export class UserTrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post('shop')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.MERCHANT)
  addNewShopCustomer(
    @Body('userId') userId: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.trackService.trackShop(userId, user.shopId);
  }
}
