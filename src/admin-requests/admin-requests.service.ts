import {
  BadRequestException,
  HttpException,
  Injectable
} from '@nestjs/common';

import { CreateAdminRequestDto } from './dto/create-admin-request.dto';
import { UpdateAdminRequestDto } from './dto/update-admin-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdminRequest,
  AdminRequestDocument,
} from './schemas/admin_request_schema';
import { ApiService} from 'src/common/filter/api.service';
import { QueryRequestDto } from './dto/query-request.dto';
import { AllRoles, IAuthUser } from 'src/common/enums';

@Injectable()
export class AdminRequestsService {
  constructor(
    @InjectModel(AdminRequest.name)
    private adminRequestModel: Model<AdminRequestDocument>,
    private apiService:ApiService<AdminRequest,QueryRequestDto>
  ) {}
  async create(createAdminRequestDto: CreateAdminRequestDto) {
      const request = await this.adminRequestModel
        .create(createAdminRequestDto);
      return {request};
  };

  async findAll(queryObj:QueryRequestDto) {
      const { paginationObj , query }=await this.apiService.getAllDocs(
        this.adminRequestModel.find(),
        queryObj
      );
      const data=await query.populate("userId");
      if( data.length == 0 ){
        throw new HttpException("No documents found",400);
      };
      return { requests:data , paginationObj };
  }

  async findOne(id: string) {
      const request = await this.adminRequestModel.findById(id);
      if( !request ){
        throw new HttpException("request not found",400);
      }
      return {request};
  }

  async update(
    id: string,
    updateAdminRequestDto: UpdateAdminRequestDto
  ) {
    const request = await this.adminRequestModel
        .findByIdAndUpdate(id, updateAdminRequestDto, { new: true });
    return {request};
  }

  async remove(id: string, user: IAuthUser ) {
      const request = await this.adminRequestModel.findById(id);
      if (!request) throw new BadRequestException("This request doesn't exist");
      if( user.role != AllRoles.ADMIN || user._id.toString() != request.userId.toString())
        throw new BadRequestException("You can't delete this request");
      await this.adminRequestModel.findByIdAndDelete(id);
      return {status:'Request deleted successfully'};
  };
};
