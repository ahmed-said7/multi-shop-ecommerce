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
import { CustomI18nService } from 'src/common/custom-i18n.service';

@Injectable()
export class AdminRequestsService {
  constructor(
    @InjectModel(AdminRequest.name)
    private adminRequestModel: Model<AdminRequestDocument>,
    private apiService:ApiService<AdminRequest,QueryRequestDto>,
    private i18n:CustomI18nService
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
        throw new HttpException(this.i18n.translate("test.admin_request.notFound"),400);
      };
      return { requests:data , paginationObj };
  }

  async findOne(id: string) {
      const request = await this.adminRequestModel.findById(id).populate("userId");
      if( !request ){
        throw new HttpException(this.i18n.translate("test.admin_request.notFound"),400);
      }
      return {request};
  }

  async update(
    id: string,
    updateAdminRequestDto: UpdateAdminRequestDto
  ) {
    const request = await this.adminRequestModel
        .findByIdAndUpdate(id, updateAdminRequestDto, { new: true });
    if(!request){
      throw new HttpException(this.i18n.translate("test.admin_request.notFound"),400);
    }
    return {request};
  }

  async remove(id: string, user: IAuthUser ) {
      const request = await this.adminRequestModel.findById(id);
      if (!request) throw new BadRequestException(this.i18n.translate("test.admin_request.notFound"));
      if( user.role != AllRoles.ADMIN && user._id.toString() != request.userId.toString())
        throw new BadRequestException(this.i18n.translate("test.admin_request.credentials"));
      await this.adminRequestModel.findByIdAndDelete(id);
      return {status:this.i18n.translate("test.admin_request.deleted")};
  };
};
