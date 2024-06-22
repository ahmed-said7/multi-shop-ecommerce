import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { TrackService } from './track.service';
import { MerchantGuard } from '../auth/guards/merchant.guard';
import { MerchantPayload } from 'src/merchant/merchant.service';
import { MerchantUser } from 'utils/extractors/merchant-user.param';

@Controller('user/track')
export class UserTrackController {
  constructor(private readonly trackService: TrackService) {}

  @UseGuards(MerchantGuard)
  @Post('shop')
  addNewShop(
    @Body('userId') userId: string,
    @MerchantUser() user: MerchantPayload,
  ) {
    return this.trackService.trackShop(userId, user.shopId);
  }
}
