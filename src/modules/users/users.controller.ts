import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() userDto: UserCreateDto) {
    return this.usersService.createUser(userDto);
  }
}
