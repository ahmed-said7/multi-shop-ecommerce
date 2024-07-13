import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { config } from "dotenv";


@Injectable()
export class jwtTokenService {
    constructor( 
        private Jwt:JwtService
    ){};
    createTokens(
        payload:{
            userId:string,
            role:string
        }
    ){
        const accessToken=
            this.Jwt.signAsync( payload , { expiresIn:"3d" } );
        const refreshToken=
            this.Jwt.signAsync(payload, { expiresIn:"80d"} );
        return { accessToken, refreshToken };
    };
};