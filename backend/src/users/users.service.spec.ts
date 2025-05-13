import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('bcrypt');

const mockRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

describe('UsersService', () => {
    let service: UsersService;
    let repo: ReturnType<typeof mockRepo>;

    beforeEach(async () => {
        repo = mockRepo();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useValue: repo },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        jest.clearAllMocks();
    });

    describe('create()', () => {
        const baseDto: CreateUserDto = {
            email: 'a@b.com',
            confirmEmail: 'a@b.com',
            password: 'Pass1',
            confirmPassword: 'Pass1',
            role: 'user',
        };

        it.each([
            [{ ...baseDto, confirmEmail: 'x@b.com' }, 'Email confirmation'],
            [{ ...baseDto, confirmPassword: 'Wrong1' }, 'Password confirmation'],
        ])('throws BadRequest on %s mismatch', async (dto, _) => {
            await expect(service.create(dto as CreateUserDto)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('throws if email exists', async () => {
            jest.spyOn(service, 'findByEmail').mockResolvedValue({} as any);
            await expect(service.create(baseDto)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('successfully creates user', async () => {
            jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

            const created = {
                email: baseDto.email,
                password: 'hashed',
                role: baseDto.role,
            };
            const saved = { id: 'u1', ...created } as User;

            repo.create.mockReturnValue(saved);
            repo.save.mockResolvedValue(saved);

            const result = await service.create(baseDto);

            expect(bcrypt.hash).toHaveBeenCalledWith(baseDto.password, 10);
            expect(repo.create).toHaveBeenCalledWith(created);
            expect(repo.save).toHaveBeenCalledWith(saved);
            expect(result).toEqual({
                id: 'u1',
                email: baseDto.email,
                role: baseDto.role,
            });
        });
    });

    describe('findAll / findOne / findByEmail', () => {
        it('findAll selects id, email, role', async () => {
            const list = [{ id: 'u2' }];
            repo.find.mockResolvedValue(list);

            const out = await service.findAll();
            expect(repo.find).toHaveBeenCalledWith({
                select: ['id', 'email', 'role'],
            });
            expect(out).toBe(list);
        });

        it.each([
            ['findOne', 'u3', { where: { id: 'u3' } }],
            ['findByEmail', 'e@f.com', { where: { email: 'e@f.com' } }],
        ])('%s calls repo.findOne', async (method, arg, expected) => {
            repo.findOne.mockResolvedValue({} as any);
            // @ts-ignore
            await service[method](arg);
            expect(repo.findOne).toHaveBeenCalledWith(expected);
        });
    });

    describe('update()', () => {
        const existing = {
            id: 'u4',
            password: 'oldhash',
            email: 'old@e.com',
            role: 'user',
        } as User;

        beforeEach(() =>
            jest.spyOn(service, 'findOne').mockResolvedValue(existing),
        );

        it('throws NotFound if missing', async () => {
            (service.findOne as jest.Mock).mockResolvedValueOnce(null);
            await expect(service.update('nx', {} as any)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('throws on email confirmation mismatch', async () => {
            await expect(
                service.update('u4', { email: 'x', confirmEmail: 'y' } as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws on password without current', async () => {
            await expect(
                service.update(
                    'u4',
                    { password: 'New1', confirmPassword: 'New1' } as any,
                ),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws Unauthorized on bad current password', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            await expect(
                service.update(
                    'u4',
                    {
                        currentPassword: 'wrong',
                        password: 'New1',
                        confirmPassword: 'New1',
                    } as any,
                ),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('throws BadRequest on new password confirmation mismatch', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            await expect(
                service.update(
                    'u4',
                    {
                        currentPassword: 'old',
                        password: 'New1',
                        confirmPassword: 'Other',
                    } as any,
                ),
            ).rejects.toThrow(BadRequestException);
        });

        it('updates password when valid', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');

            const saved = { ...existing, password: 'newhash' };
            repo.save.mockResolvedValue(saved);
            jest
                .spyOn(service, 'findOne')
                .mockResolvedValueOnce(existing)
                .mockResolvedValueOnce(saved);

            const res = await service.update(
                'u4',
                {
                    currentPassword: 'old',
                    password: 'New1',
                    confirmPassword: 'New1',
                } as any,
            );
            expect(bcrypt.compare).toHaveBeenCalledWith('old', 'oldhash');
            expect(bcrypt.hash).toHaveBeenCalledWith('New1', 10);
            expect(res).toEqual({
                id: 'u4',
                email: existing.email,
                role: existing.role,
            });
        });

        it('updates email only', async () => {
            repo.update.mockResolvedValue(undefined);
            const updated = { ...existing, email: 'new@e.com' };
            jest
                .spyOn(service, 'findOne')
                .mockResolvedValueOnce(existing)
                .mockResolvedValueOnce(updated);

            const res = await service.update(
                'u4',
                { email: 'new@e.com', confirmEmail: 'new@e.com' } as any,
            );
            expect(repo.update).toHaveBeenCalledWith('u4', {
                email: 'new@e.com',
            });
            expect(res.email).toBe('new@e.com');
        });

        it('no-op update returns user', async () => {
            repo.update.mockResolvedValue(undefined);
            jest
                .spyOn(service, 'findOne')
                .mockResolvedValueOnce(existing)
                .mockResolvedValueOnce(null);
            await expect(service.update('u4', {} as any)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('remove()', () => {
        it('deletes and returns user', async () => {
            const user = { id: 'u5' } as User;
            jest.spyOn(service, 'findOne').mockResolvedValue(user);
            repo.delete.mockResolvedValue(undefined);

            const res = await service.remove('u5');
            expect(repo.delete).toHaveBeenCalledWith('u5');
            expect(res).toBe(user);
        });
    });

    describe('resetPasswordByEmail()', () => {
        it.each([
            [{}, 'Email is required'],
            [{ email: 'x' }, 'Password is required'],
            [{ email: 'x', password: 'p1' }, 'Password confirmation'],
        ])('throws BadRequest for missing fields %#', async (dto, _) => {
            // @ts-ignore
            await expect(service.resetPasswordByEmail(dto)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('throws BadRequest on password confirmation mismatch', async () => {
            await expect(
                service.resetPasswordByEmail({
                    email: 'e',
                    password: 'p1',
                    confirmPassword: 'p2',
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws if user not found', async () => {
            jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
            await expect(
                service.resetPasswordByEmail({
                    email: 'e',
                    password: 'p1',
                    confirmPassword: 'p1',
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('resets password when valid', async () => {
            const user = { id: '1', email: 'e', password: 'old' } as User;
            jest.spyOn(service, 'findByEmail').mockResolvedValue(user);
            (bcrypt.hash as jest.Mock).mockResolvedValue('new');
            repo.save.mockImplementation((u) => Promise.resolve(u));

            const res = await service.resetPasswordByEmail({
                email: 'e',
                password: 'p1',
                confirmPassword: 'p1',
            });
            expect(repo.save).toHaveBeenCalled();
            expect(res).toEqual({ id: '1', email: 'e' });
        });
    });
});