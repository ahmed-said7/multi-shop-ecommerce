import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

import { MerchantPayload } from '../../src/merchant/merchant.service';

export const MerchantUser = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request?.user as MerchantPayload) || null;
  },
);
