import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { NotFoundException } from '@nestjs/common';

describe('ContactController', () => {
    let controller: ContactController;
    let service: ContactService;

    const mockContact = {
        id: 'test-id',
        fullName: 'John Doe',
        phone: '(11) 98765-4321',
        email: 'john@example.com',
        city: 'São Paulo',
        state: 'SP',
        interestUuid: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: new Date(),
        isActive: true,
        isDog: true,
    };

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        getActiveContactsCount: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ContactController],
            providers: [
                {
                    provide: ContactService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<ContactController>(ContactController);
        service = module.get<ContactService>(ContactService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new contact', async () => {
            const createDto: CreateContactDto = {
                fullName: 'John Doe',
                phone: '(11) 98765-4321',
                email: 'john@example.com',
                city: 'São Paulo',
                state: 'SP',
                interestUuid: '550e8400-e29b-41d4-a716-446655440000',
                isDog: true,
            };

            mockService.create.mockResolvedValue(mockContact);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockContact);
        });
    });

    describe('findAll', () => {
        it('should return paginated contacts with default pagination and isActive undefined', async () => {
            const paginatedResponse = {
                data: [mockContact],
                pagination: {
                    total: 10,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    hasNext: false,
                    hasPrevious: false,
                },
            };
            mockService.findAll.mockResolvedValue(paginatedResponse);

            const result = await controller.findAll(undefined, undefined, undefined);

            expect(service.findAll).toHaveBeenCalledWith({
                page: undefined,
                limit: undefined,
                isActive: undefined,
            });
            expect(result).toEqual(paginatedResponse);
        });

        it('should parse numeric page/limit and boolean isActive=true', async () => {
            const paginatedResponse = {
                data: [mockContact],
                pagination: { total: 5, page: 1, limit: 5, totalPages: 1, hasNext: false, hasPrevious: false },
            };
            mockService.findAll.mockResolvedValue(paginatedResponse);

            const result = await controller.findAll(1, 5, true);

            expect(service.findAll).toHaveBeenCalledWith({
                page: 1,
                limit: 5,
                isActive: true,
            });
            expect(result).toEqual(paginatedResponse);
        });

        it('should parse isActive=false correctly', async () => {
            const paginatedResponse = { data: [mockContact], pagination: { total: 2, page: 2, limit: 1, totalPages: 2, hasNext: false, hasPrevious: true } };
            mockService.findAll.mockResolvedValue(paginatedResponse);

            const result = await controller.findAll(undefined, undefined, 'false' as any);

            expect(service.findAll).toHaveBeenCalledWith({
                page: undefined,
                limit: undefined,
                isActive: false,
            });
            expect(result).toEqual(paginatedResponse);
        });

        it('should use provided pagination parameters without isActive when not passed', async () => {
            const paginatedResponse = {
                data: [mockContact],
                pagination: {
                    total: 20,
                    page: 2,
                    limit: 5,
                    totalPages: 4,
                    hasNext: true,
                    hasPrevious: true,
                },
            };
            mockService.findAll.mockResolvedValue(paginatedResponse);

            const result = await controller.findAll(2, 5);

            expect(service.findAll).toHaveBeenCalledWith({
                page: 2,
                limit: 5,
                isActive: undefined,
            });
            expect(result).toEqual(paginatedResponse);
        });
    });

    describe('findOne', () => {
        it('should return a contact by id', async () => {
            mockService.findOne.mockResolvedValue(mockContact);

            const result = await controller.findOne('test-id');

            expect(service.findOne).toHaveBeenCalledWith('test-id');
            expect(result).toEqual(mockContact);
        });

        it('should throw NotFoundException if contact not found', async () => {
            mockService.findOne.mockRejectedValue(new NotFoundException());

            await expect(controller.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a contact', async () => {
            const updateDto: UpdateContactDto = { fullName: 'Updated Name' };
            const updatedContact = { ...mockContact, ...updateDto };
            mockService.update.mockResolvedValue(updatedContact);

            const result = await controller.update('test-id', updateDto);

            expect(service.update).toHaveBeenCalledWith('test-id', updateDto);
            expect(result).toEqual(updatedContact);
        });

        it('should throw NotFoundException if contact to update not found', async () => {
            mockService.update.mockRejectedValue(new NotFoundException());
            await expect(controller.update('nonexistent-id', {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a contact', async () => {
            mockService.remove.mockResolvedValue(undefined);
            await controller.remove('test-id');
            expect(service.remove).toHaveBeenCalledWith('test-id');
        });

        it('should throw NotFoundException if contact to remove not found', async () => {
            mockService.remove.mockRejectedValue(new NotFoundException());
            await expect(controller.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getActiveCount', () => {
        it('should return an object with count property', async () => {
            mockService.getActiveContactsCount.mockResolvedValue(42);

            const result = await controller.getActiveCount();

            expect(service.getActiveContactsCount).toHaveBeenCalled();
            expect(result).toEqual({ count: 42 });
        });

        it('should propagate errors from service', async () => {
            mockService.getActiveContactsCount.mockRejectedValue(new Error('fail'));

            await expect(controller.getActiveCount()).rejects.toThrow('fail');
        });
    });
});