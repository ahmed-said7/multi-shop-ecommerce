import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { TrackService } from './track.service';
import { MerchantGuard } from 'src/auth/guards/merchant.guard';

@Controller('user/track')
export class UserTrackController {
  constructor(private readonly trackService: TrackService) {}

  @UseGuards(JwtGuard, MerchantGuard)
  @Post('shop')
  addNewShop(@Body('userId') userId: string, @Body('shopId') shopId: string) {
    return this.trackService.trackShop(userId, shopId);
  }
}
