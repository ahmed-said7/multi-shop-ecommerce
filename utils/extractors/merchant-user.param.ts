import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

export const MerchantUser = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request?.user || null;
  },
);
