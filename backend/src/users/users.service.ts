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

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
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

    // Hash password before creating user
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with validated fields and hashed password
    const user = this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
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
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
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

    if (updateUserDto.password) {
      // Verify current password
      if (!updateUserDto.currentPassword) {
        throw new BadRequestException('Current password is required to change password');
      }

      const isPasswordValid = await bcrypt.compare(updateUserDto.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new BadRequestException('Password confirmation does not match');
      }

      // Update only the password
      user.password = await bcrypt.hash(updateUserDto.password, 10);
      await this.userRepository.save(user);
    }

    // Filter validation fields and update only valid fields
    const updateData = {
      email: updateUserDto.email
    };

    // Remove undefined properties
    Object.keys(updateData).forEach(key =>
      updateData[key] === undefined && delete updateData[key]
    );

    if (Object.keys(updateData).length > 0) {
      await this.userRepository.update(id, updateData);
    }

    // Return user WITHOUT password
    const updatedUser = await this.findOne(id);
    // Check if user exists before destructuring
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }
    // Return a new object without the password property
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
    return user;
  }
}
