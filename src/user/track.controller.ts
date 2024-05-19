import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { TrackService } from './track.service';

@Controller('user/track')
export class UserTrackController {
  constructor(private readonly trackService: TrackService) {}

  @UseGuards(JwtGuard)
  @Post('shop')
  addNewShop(@Body('userId') userId: string, @Body('shopId') shopId: string) {
    return this.trackService.trackShop(userId, shopId);
  }
}
