import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>
    ) { }

    async create(dto: any) {
        const { email, password, name } = dto;

        const existing = await this.userModel.findOne({ email });
        if (existing) {
            throw new ConflictException('Mật khẩu/Email đã tồn tại trong hệ thống');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return this.userModel.create({
            email,
            password: hashedPassword,
            name
        });
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).lean();
    }

    async findById(id: string) {
        return this.userModel.findById(id).select('-password').lean();
    }
}
