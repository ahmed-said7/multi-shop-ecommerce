import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Request,
  UseGuards,
} from '@nestjs/common';

import mongoose from 'mongoose';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from './email/email.service';
import { User } from './schemas/user_schema';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.emailService.emailOTPCode(
      createUserDto.email,
      createUserDto.name,
    );

    return this.userService.register(createUserDto);
  }

  @Post('register/shop')
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerShop(@Body() registerData: any) {
    await this.emailService.emailOTPCode(
      registerData.user.email,
      registerData.user.name,
    );

    return this.userService.registerShop(registerData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Request() req) {
    const user = req.user;

    return await this.authService.login(user);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Param('page') page: number, @Body('userId') userId: string) {
    return this.userService.findAll(userId, page);
  }

  @UseGuards(JwtGuard)
  @Get('one')
  findOneUser(@Body('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch('/checkout/:id')
  checkout(@Param('id') id: string) {
    return this.userService.checkOut(id);
  }

  @UseGuards(JwtGuard)
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @Body('userId') userId: string) {
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
<<<<<<< HEAD
  remove(
    @Param('id') id: string,
    @Body('id') deleteId: string,
    @Body('userId') userId: string,
  ) {
=======
  remove(@Param('id') id: string, @Body('userId') userId: string) {
>>>>>>> f721c53abe32e9a629b51caba26f34773cea9e39
    return this.userService.remove(id, userId);
  }

  @UseGuards(JwtGuard)
  @Patch('/fav/:id')
  addFavoriute(@Param('id') itemId: string, @Body('userId') userId: string) {
    return this.userService.addFav(itemId, userId);
  }

  @UseGuards(JwtGuard)
  @Patch('/cart/add')
  addToCart(
    @Body() itemId: mongoose.Types.ObjectId,
    @Body('userId') userId: string,
  ) {
    return this.userService.addToCart(itemId, userId);
  }

  @UseGuards(JwtGuard)
  @Patch('/cart/remove')
  removeFromCart(
    @Body() itemId: mongoose.Types.ObjectId,
    @Body('userId') userId: string,
  ) {
    return this.userService.removeItemCart(itemId, userId);
  }
}
