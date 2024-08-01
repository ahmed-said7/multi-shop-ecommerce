import { Module } from '@nestjs/common';
import { jwtTokenService } from './jwt.service';

@Module({
  providers: [jwtTokenService],
  exports: [jwtTokenService],
})
export class jwtTokenModule {}
