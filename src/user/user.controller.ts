import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { UserService } from './user.service';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { Roles } from 'src/common/decorator/roles';
import { UserRole } from './schemas/user_schema';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Param('page') page: string) {
    return this.userService.findAll(page);
  }


  @Get('me')
  @UseGuards(AuthenticationGuard)
  findLoggedUser( @AuthUser('_id') userId: string ) {
    return this.userService.findOne(userId);
  }

  
  @Get(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER,UserRole.ADMIN,UserRole.MERCHANT)
  findOneUser(@Param('id', ValidateObjectIdPipe) userId: string ) {
    return this.userService.findOne(userId);
  }

  
  @Patch()
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER,UserRole.ADMIN)
  updateLoggedUser(@Body() updateUserDto: UpdateUserDto, @AuthUser('_id') userId: string ) {
    return this.userService.update(userId, updateUserDto);
  }

  
  @Delete(':id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER,UserRole.ADMIN)
  removeLoggedUser(
    @AuthUser('_id') userId: string
  ) {
    return this.userService.remove(userId);
  }

  
  @Patch('/fav/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  addFavorite(
    @Param('id', ValidateObjectIdPipe) itemId: string,
    @AuthUser('_id') userId: string
  ) {
    return this.userService.addFav(itemId, userId);
  }
  

  @Delete('/fav/:id')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(UserRole.USER)
  removeFavorite(
    @Param('id', ValidateObjectIdPipe) itemId: string,
    @AuthUser('_id') userId: string
  ) {
    return this.userService.removeFav(itemId, userId);
  }
}
