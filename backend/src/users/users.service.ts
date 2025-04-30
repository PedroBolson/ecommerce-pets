import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'hashPassword'>> {
    // Validate confirmation fields
    if (createUserDto.email !== createUserDto.confirmEmail) {
      throw new BadRequestException('Email confirmation does not match');
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Password confirmation does not match');
    }

    // Check if user with this email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Create user with validated fields only
    const user = this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role || 'user'
    });

    await this.userRepository.save(user);

    // Remove password from response
    const { password, ...result } = user;
    return result;
  }

  findAll() {
    return this.userRepository.find({
      select: ['id', 'email', 'role']
    });
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate confirmation fields
    if (updateUserDto.email && updateUserDto.confirmEmail !== updateUserDto.email) {
      throw new BadRequestException('Email confirmation does not match');
    }

    if (updateUserDto.newPassword) {
      // Verify current password
      if (!updateUserDto.currentPassword) {
        throw new BadRequestException('Current password is required to change password');
      }

      const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      if (updateUserDto.newPassword !== updateUserDto.confirmNewPassword) {
        throw new BadRequestException('Password confirmation does not match');
      }

      // Update only the password
      user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
      await this.userRepository.save(user);
    }

    // Filter validation fields and update only valid fields
    const updateData = {
      email: updateUserDto.email
      // Other entity fields that can be updated
    };

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
    return user;
  }
}
