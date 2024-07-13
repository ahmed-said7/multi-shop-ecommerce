import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { TrackService } from './track.service';
import { MerchantGuard } from '../auth/guards/merchant.guard';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { MerchantUser } from 'utils/extractors/merchant-user.param';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { UserRole } from './schemas/user_schema';
import { Roles } from 'src/common/decorator/roles';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { IAuthUser } from 'src/common/enums';

@Controller('user/track')
export class UserTrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post('shop')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.MERCHANT)
  addNewShopCustomer(
    @Body('userId') userId: string,
    @AuthUser() user: IAuthUser,
  ) {
    return this.trackService.trackShop(userId, user.shopId);
  }
}
