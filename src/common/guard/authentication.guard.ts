import { JwtService } from '@nestjs/jwt';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { InjectModel } from '@nestjs/mongoose';
import { Merchant, MerchantDocument } from 'src/merchant/schema/merchant.schema';
import { Model } from 'mongoose';
import { AllRoles } from '../enums';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Merchant.name) private readonly merchantModel: Model<MerchantDocument>,
    ) {};
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        if (!request.headers.authorization) {
            throw new UnauthorizedException('Authorization header is missing');
        }
        const token = request.header('authorization').split(' ')[1];
        let payload: {userId:string; role:string }
        try{
            payload = await this.jwtService.verifyAsync(token);
        }catch(e){
            return false;
        };
        if ( !payload || !payload.userId || payload.role ) {
            return false;
        };
        let user;
        switch(payload.role){
            case AllRoles.ADMIN || AllRoles.USER:
                user=await this.userModel.findById(payload.userId);
                break;
            case AllRoles.MERCHANT:
                user=await this.merchantModel.findById(payload.userId);
                break;
        };
        if( !user ){
            return false;
        };
        request.user = { role:user.role , _id:payload.userId , shopId:user.shopId };
        return true;
    }
}