import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { ConflictException } from '@nestjs/common';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user with default preference values', async () => {
      const dto: CreateUserDto = {
        email: 'test1@example.com',
        telephone: '+1234567890',
        preferences: { email: true }, 
      };

      const res = await service.create(dto);

      expect(res).toMatchObject({
        email: dto.email,
        telephone: dto.telephone,
        preferences: { email: true, sms: false },
      });
      expect(res.userId).toBeDefined();
    });

    it('should throw ConflictException for existing users', async () => {
      const dto: CreateUserDto = {
        email: 'duplicate@example.com',
        telephone: '+1234567890',
        preferences: { email: false, sms: true },
      };

      await service.create(dto);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update user preferences', async () => {
      const createDto: CreateUserDto = {
        email: 'update@example.com',
        telephone: '+1234567891',
        preferences: { email: true, sms: false },
      };
      await service.create(createDto);

      const updateDto: UpdatePreferencesDto = {
        email: createDto.email,
        preferences: { email: false, sms: true },
      };

      const updated = await service.update(updateDto);
      expect(updated.preferences).toEqual({ email: false, sms: true });
    })
  });

  describe('finding users', () => {
    it('should find user by id and email', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        telephone: '+1234567890',
        preferences: { email: true, sms: false },
      };

      const created = await service.create(dto);

      const userFoundById = await service.findOne(created.userId);
      const userFoundByEmail = await service.findByEmail(dto.email);

      expect(userFoundById).toEqual(created);
      expect(userFoundByEmail).toEqual(created);
    })
  });
});
