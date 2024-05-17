import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAdminRequestDto } from './dto/create-admin-request.dto';
import { UpdateAdminRequestDto } from './dto/update-admin-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdminRequest,
  AdminRequestDocument,
} from './schemas/admin_request_schema';
import { User, UserDocument, UserRole } from 'src/user/schemas/user_schema';

@Injectable()
export class AdminRequestsService {
  constructor(
    @InjectModel(AdminRequest.name)
    private adminRequestModel: Model<AdminRequestDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createAdminRequestDto: CreateAdminRequestDto) {
    try {
      const request = await this.adminRequestModel
        .create(createAdminRequestDto)
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      return request;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(userId?: string) {
    try {
      const query = {};
      query['userId'] = userId;
      if (userId == undefined) delete query['userId'];
      const requests = await this.adminRequestModel.find(query).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });

      return requests;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const request = await this.adminRequestModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      return request;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    updateAdminRequestDto: UpdateAdminRequestDto,
    userId: string,
  ) {
    try {
      const user = await this.userModel.findById(userId).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      if (user.role != UserRole.ADMIN)
        throw new InternalServerErrorException('You are not an admin');
      const request = await this.adminRequestModel
        .findByIdAndUpdate(id, updateAdminRequestDto, { new: true })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      return request;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const user = await this.userModel.findById(userId).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      const request = await this.adminRequestModel.findById(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      if (!request) throw new BadRequestException("This request doesn't exist");
      if (!user || user.role != UserRole.ADMIN || user.id != request.userId)
        throw new BadRequestException("You can't delete this request");
      await this.adminRequestModel.findByIdAndDelete(id).catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(err);
      });
      return 'Request deleted successfully';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
