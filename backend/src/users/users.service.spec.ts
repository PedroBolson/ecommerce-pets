import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
    let service: UsersService;
    let repo: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('create', () => {
        const dto: CreateUserDto = {
            email: 'a@b.com',
            confirmEmail: 'a@b.com',
            password: 'Password1',
            confirmPassword: 'Password1',
            role: 'user',
        };

        it('should throw if email confirmation does not match', async () => {
            await expect(
                service.create({ ...dto, confirmEmail: 'x@b.com' }),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw if password confirmation does not match', async () => {
            await expect(
                service.create({ ...dto, confirmPassword: 'Wrong1' }),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw if email already exists', async () => {
            jest.spyOn(service, 'findByEmail').mockResolvedValue({} as User);
            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should create user with hashed password', async () => {
            // Arrange
            const mockHashedPassword = '$2b$10$ABCDEFGHIJKLMNOPQRSTUV';
            jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

            const userToCreate = {
                email: dto.email,
                password: mockHashedPassword,
                role: dto.role
            };

            const savedUser = {
                id: 'u1',
                email: dto.email,
                password: mockHashedPassword,
                role: dto.role
            } as User;

            (repo.create as jest.Mock).mockReturnValue(savedUser);
            (repo.save as jest.Mock).mockResolvedValue(savedUser);

            // Act
            const result = await service.create(dto);

            // Assert
            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
            expect(repo.create).toHaveBeenCalledWith(userToCreate);
            expect(repo.save).toHaveBeenCalledWith(savedUser);

            // Check that password is excluded from response
            expect(result).not.toHaveProperty('password');
            expect(result).toEqual({
                id: 'u1',
                email: dto.email,
                role: dto.role
            });
        });
    });

    describe('findAll', () => {
        it('should return users without password', async () => {
            const list = [{ id: 'u2', email: 'c@d.com', role: 'user' }] as any;
            (repo.find as jest.Mock).mockResolvedValue(list);
            const result = await service.findAll();
            expect(result).toBe(list);
            expect(repo.find).toHaveBeenCalledWith({ select: ['id', 'email', 'role'] });
        });
    });

    describe('findOne & findByEmail', () => {
        it('findOne should call repo.findOne with id', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue({} as User);
            await service.findOne('u3');
            expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'u3' } });
        });

        it('findByEmail should call repo.findOne with email', async () => {
            (repo.findOne as jest.Mock).mockResolvedValue({} as User);
            await service.findByEmail('e@f.com');
            expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'e@f.com' } });
        });
    });

    describe('update', () => {
        const baseUser = { id: 'u4', password: 'oldhash', email: 'old@e.com', role: 'user' } as User;
        beforeEach(() => {
            jest.spyOn(service, 'findOne').mockResolvedValue(baseUser);
        });

        it('should throw if user not found', async () => {
            (service.findOne as jest.Mock).mockResolvedValue(null);
            await expect(service.update('nx', {} as any)).rejects.toThrow(NotFoundException);
        });

        it('should throw if email confirmation mismatch', async () => {
            await expect(
                service.update('u4', { email: 'x@e.com', confirmEmail: 'y@e.com' } as UpdateUserDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw if newPassword without currentPassword', async () => {
            await expect(
                service.update('u4', { password: 'New1', confirmPassword: 'New1' } as UpdateUserDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw if currentPassword invalid', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            await expect(
                service.update('u4', { currentPassword: 'wrong', password: 'New1', confirmPassword: 'New1' } as UpdateUserDto),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw if newPassword confirmation mismatch', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            await expect(
                service.update('u4', { currentPassword: 'old', password: 'New1', confirmPassword: 'Other' } as UpdateUserDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('should update password if valid', async () => {
            // Setup
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');

            const userWithPassword = {
                id: 'u4',
                email: 'old@e.com',
                password: 'newhash',
                role: 'user'
            };
            const userWithoutPassword = {
                id: 'u4',
                email: 'old@e.com',
                role: 'user'
            };

            // Mock save to return user with password
            (repo.save as jest.Mock).mockResolvedValue(userWithPassword);

            // First mock call is for initial user fetch
            // Second mock call is for fetching updated user after changes
            (service.findOne as jest.Mock)
                .mockImplementationOnce(() => Promise.resolve(baseUser))
                .mockImplementationOnce(() => {
                    return Promise.resolve(userWithPassword);
                });

            // Act
            const updated = await service.update('u4', {
                currentPassword: 'old',
                password: 'New1',
                confirmPassword: 'New1'
            } as UpdateUserDto);

            // Assert
            expect(bcrypt.compare).toHaveBeenCalledWith('old', 'oldhash');
            expect(bcrypt.hash).toHaveBeenCalledWith('New1', 10);
            expect(repo.save).toHaveBeenCalled();

            // Test that the service correctly removed the password property
            expect(updated).toEqual(userWithoutPassword);
            expect(updated).not.toHaveProperty('password');
        });

        it('should update email only', async () => {
            (repo.update as jest.Mock).mockResolvedValue(undefined);
            jest.spyOn(service, 'findOne').mockResolvedValue({ ...baseUser, email: 'new@e.com' } as User);

            const updated = await service.update('u4', { email: 'new@e.com', confirmEmail: 'new@e.com' } as UpdateUserDto);
            expect(repo.update).toHaveBeenCalledWith('u4', { email: 'new@e.com' });
            expect(updated).not.toBeNull();
            expect(updated!.email).toBe('new@e.com');
        });
    });

    describe('remove', () => {
        it('should delete and return user', async () => {
            const user = { id: 'u5' } as User;
            jest.spyOn(service, 'findOne').mockResolvedValue(user);
            (repo.delete as jest.Mock).mockResolvedValue(undefined);

            const result = await service.remove('u5');
            expect(repo.delete).toHaveBeenCalledWith('u5');
            expect(result).toBe(user);
        });
    });
});

describe('StoreItemImageService', () => {
});
