import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { TrackService } from './track.service';
import { MerchantGuard } from '../auth/guards/merchant.guard';

@Controller('user/track')
export class UserTrackController {
  constructor(private readonly trackService: TrackService) {}

  @UseGuards(MerchantGuard)
  @Post('shop')
  addNewShop(@Body('userId') userId: string, @Body('shopId') shopId: string) {
    return this.trackService.trackShop(userId, shopId);
  }
}
