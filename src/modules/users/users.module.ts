import { CompanyService } from 'src/services/company/company.service';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from '../../config/services';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, CompanyService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
