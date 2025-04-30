import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should successfully create a user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password',
                role: 'user',
                confirmEmail: 'test@example.com',
                confirmPassword: 'password',
            };

            jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');

            const mockUser = {
                id: 'user-id',
                email: 'test@example.com',
                role: 'user',
                hashPassword: jest.fn(),
            };

            jest.spyOn(repository, 'create').mockReturnValue(mockUser as any);
            jest.spyOn(repository, 'save').mockResolvedValue(mockUser as any);

            const result = await service.create(createUserDto);

            expect(repository.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'user',
            });
            expect(repository.save).toHaveBeenCalled();

            expect(result).toEqual(expect.objectContaining({
                id: 'user-id',
                email: 'test@example.com',
                role: 'user',
            }));
        });
    });
});