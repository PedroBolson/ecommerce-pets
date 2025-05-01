import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
    let controller: UsersController;
    let service: Partial<Record<keyof UsersService, jest.Mock>>;

    beforeEach(async () => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        controller = new UsersController(service as unknown as UsersService);
    });

    it('should create a new user', async () => {
        const dto: CreateUserDto = {
            email: 'test@example.com',
            confirmEmail: 'test@example.com',
            password: 'Password1',
            confirmPassword: 'Password1',
            role: 'user',
        };
        const result = { id: 'u1', email: dto.email, role: dto.role } as Omit<User, 'password'>;
        service.create!.mockResolvedValue(result);

        expect(await controller.create(dto)).toEqual(result);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should return an array of users', async () => {
        const users = [{ id: 'u2', email: 'a@b.com', role: 'user' }] as Omit<User, 'password'>[];
        service.findAll!.mockResolvedValue(users as any);

        expect(await controller.findAll()).toEqual(users);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should return a single user', async () => {
        const user = { id: 'u3', email: 'c@d.com', role: 'admin' } as User;
        service.findOne!.mockResolvedValue(user as any);

        expect(await controller.findOne('u3')).toEqual(user);
        expect(service.findOne).toHaveBeenCalledWith('u3');
    });

    it('should update a user', async () => {
        const dto: UpdateUserDto = { email: 'new@e.com', confirmEmail: 'new@e.com' };
        const updated = { id: 'u4', email: dto.email, role: 'user' } as User;
        service.update!.mockResolvedValue(updated as any);

        expect(await controller.update('u4', dto)).toEqual(updated);
        expect(service.update).toHaveBeenCalledWith('u4', dto);
    });

    it('should remove a user', async () => {
        const removed = { id: 'u5', email: 'f@g.com', role: 'user' } as User;
        service.remove!.mockResolvedValue(removed as any);

        expect(await controller.remove('u5')).toEqual(removed);
        expect(service.remove).toHaveBeenCalledWith('u5');
    });
});
