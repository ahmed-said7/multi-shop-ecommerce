import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from '../schemas/otp-schema';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private readonly otpModel: Model<Otp>) {}
  async createOtp() {
      const randOtp = this.generateRandomOtpNumber();
      const otp = await this.otpModel.create({ number: randOtp });
      return { otp : otp.number};
  };
  private generateRandomOtpNumber() {
    return faker.number.int({ min: 1000, max: 9999 });
  };
};
