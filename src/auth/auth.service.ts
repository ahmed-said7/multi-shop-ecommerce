import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login.dto';
import { jwtTokenService } from 'src/jwt/jwt.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user_schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userService: UserService,
    private jwt:jwtTokenService
  ) {};
  
  async register(createUserDto: CreateUserDto) {
    const { email, phone } = createUserDto;
    const foundUser = await this.userModel.findOne({ 
      $or:[{ email } , { phone } ]
    });
    if (foundUser) {
      throw new BadRequestException('There is a user with the same email or phone!');
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const savedUser=await this.userModel.create(createUserDto);
    const { accessToken , refreshToken } =await this.jwt.createTokens({
      userId: savedUser._id.toString(),
      role:savedUser.role
    });
    return { accessToken ,  refreshToken , user:savedUser.toObject() };
  };

  async loginUser(body:LoginUserDto) {
    const { foundUser : user } = await this.userService.findOneWithEmail(body.email);
    const valid=await bcrypt.compare(body.password, user.password);
    if ( ! valid ) {
      throw new HttpException("email or password is not correct",400)
    };
    const {accessToken,refreshToken}=await this.jwt.createTokens({
      userId: user._id.toString(),
      role:user.role
    });
    return { accessToken , refreshToken };
  };

};
