import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVerify } from '../entities/user-verify.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserVerifyService {
  constructor(
    @InjectRepository(UserVerify)
    private readonly userVerifyRepository: Repository<UserVerify>,
  ) {}

  save(userVerify: UserVerify) {
    return this.userVerifyRepository.save(userVerify);
  }
}
