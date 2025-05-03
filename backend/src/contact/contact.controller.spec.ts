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
        createdAt: new Date(),
        isActive: true
    };

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
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

        // Clear all mocks before each test
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
                state: 'SP'
            };

            mockService.create.mockResolvedValue(mockContact);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockContact);
        });
    });

    describe('findAll', () => {
        it('should return paginated contacts with default pagination', async () => {
            const paginatedResponse = {
                data: [mockContact],
                pagination: {
                    total: 10,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    hasNext: false,
                    hasPrevious: false
                }
            };

            mockService.findAll.mockResolvedValue(paginatedResponse);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalledWith({
                page: undefined,
                limit: undefined
            });
            expect(result).toEqual(paginatedResponse);
        });

        it('should use provided pagination parameters', async () => {
            const paginatedResponse = {
                data: [mockContact],
                pagination: {
                    total: 20,
                    page: 2,
                    limit: 5,
                    totalPages: 4,
                    hasNext: true,
                    hasPrevious: true
                }
            };

            mockService.findAll.mockResolvedValue(paginatedResponse);

            const result = await controller.findAll(2, 5);

            expect(service.findAll).toHaveBeenCalledWith({
                page: 2,
                limit: 5
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
            const updateDto: UpdateContactDto = {
                fullName: 'Updated Name'
            };
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
});