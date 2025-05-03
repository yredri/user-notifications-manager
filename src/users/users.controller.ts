import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(+id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Put()
  async update(@Body() updatePreferencesDto: UpdatePreferencesDto): Promise<User> {
    return await this.usersService.update(updatePreferencesDto);
  }
}
