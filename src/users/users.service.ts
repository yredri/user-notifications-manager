import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
    private users = new Map<number, User>();
    private emailToUserIdMap = new Map<string, number>();
    private nextUserId = 5;

    constructor() {
        this.seedUsers();
    }

    async findAll(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    async findOne(id: number): Promise<User> {
        const user = this.users.get(id);
        if(!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const userId = this.emailToUserIdMap.get(email);
        const user = userId ? this.users.get(userId) : null;

        if(!user) {
            throw new NotFoundException(`User with email: ${email} not found`);
        }

        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, telephone, preferences } = createUserDto;

        if(this.emailToUserIdMap.has(email)) {
            throw new ConflictException(`User ${email} already exists`);
        }

        const userId = this.nextUserId++;
        const newUser: User = {
            userId,
            email,
            telephone,
            preferences: {
                email: preferences.email ?? false,
                sms: preferences.sms ?? false,
            },
        };

        this.users.set(userId, newUser);
        this.emailToUserIdMap.set(email, userId);

        return newUser;
    }

    async update(updatePreferencesDto: UpdatePreferencesDto): Promise<User> {
        const userId = this.emailToUserIdMap.get(updatePreferencesDto.email);

        if (!userId) {
          throw new NotFoundException(`User with email ${updatePreferencesDto.email} not found`);
        }

        const user = this.users.get(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        user.preferences = {
            ...user.preferences,
            ...updatePreferencesDto.preferences,
        };

        this.users.set(userId, user);

        return user;
    }

    private seedUsers() {
        const initialUsers: User[] = [
          {
            userId: 1,
            email: 'ironman@avengers.com',
            telephone: '+123456789',
            preferences: { email: true, sms: true },
          },
          {
            userId: 2,
            email: 'loki@avengers.com',
            telephone: '+123456788',
            preferences: { email: true, sms: false },
          },
          {
            userId: 3,
            email: 'hulk@avengers.com',
            telephone: '+123456787',
            preferences: { email: false, sms: false },
          },
          {
            userId: 4,
            email: 'blackwidow@avengers.com',
            telephone: '+123456786',
            preferences: { email: true, sms: true },
          },
        ];
      
        for (const user of initialUsers) {
          this.users.set(user.userId, user);
          this.emailToUserIdMap.set(user.email, user.userId);
        }
      
        this.nextUserId = 5;
      }
}
