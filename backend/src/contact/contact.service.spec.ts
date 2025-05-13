import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ContactService', () => {
    let service: ContactService;
    let repository: Repository<Contact>;

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
        isDog: true
    };

    // Create mock functions that track their calls
    const whereMock = jest.fn().mockReturnThis();
    const orderByMock = jest.fn().mockReturnThis();
    const skipMock = jest.fn().mockReturnThis();
    const takeMock = jest.fn().mockReturnThis();
    const getManyMock = jest.fn();
    const getCountMock = jest.fn();

    const queryBuilderMock = {
        where: whereMock,
        orderBy: orderByMock,
        skip: skipMock,
        take: takeMock,
        getMany: getManyMock,
        getCount: getCountMock
    };

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        createQueryBuilder: jest.fn(() => queryBuilderMock),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ContactService,
                {
                    provide: getRepositoryToken(Contact),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<ContactService>(ContactService);
        repository = module.get<Repository<Contact>>(getRepositoryToken(Contact));

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new contact', async () => {
            const createDto = {
                fullName: 'John Doe',
                phone: '(11) 98765-4321',
                email: 'john@example.com',
                city: 'São Paulo',
                state: 'SP',
                interestUuid: '550e8400-e29b-41d4-a716-446655440000',
                isDog: true
            };

            mockRepository.create.mockReturnValue(mockContact);
            mockRepository.save.mockResolvedValue(mockContact);

            const result = await service.create(createDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockContact);
            expect(result).toEqual(mockContact);
        });

        describe('findAll', () => {
            it('should return paginated contacts with default pagination', async () => {
                const contacts = [mockContact];
                getCountMock.mockResolvedValue(10);
                getManyMock.mockResolvedValue(contacts);

                const result = await service.findAll();

                expect(orderByMock).toHaveBeenCalledWith('contact.createdAt', 'DESC');
                expect(skipMock).toHaveBeenCalledWith(0); // (page-1) * limit = 0
                expect(takeMock).toHaveBeenCalledWith(10);
                expect(result).toEqual({
                    data: contacts,
                    pagination: {
                        total: 10,
                        page: 1,
                        limit: 10,
                        totalPages: 1,
                        hasNext: false,
                        hasPrevious: false
                    }
                });
            });

            it('should use custom pagination parameters', async () => {
                const contacts = [mockContact];
                getCountMock.mockResolvedValue(30);
                getManyMock.mockResolvedValue(contacts);

                const result = await service.findAll({ page: 2, limit: 5 });

                expect(skipMock).toHaveBeenCalledWith(5); // (page-1) * limit
                expect(takeMock).toHaveBeenCalledWith(5);
                expect(result.pagination).toEqual({
                    total: 30,
                    page: 2,
                    limit: 5,
                    totalPages: 6, // ceil(30/5)
                    hasNext: true,
                    hasPrevious: true
                });
            });
        });

        describe('findOne', () => {
            it('should return a contact if found', async () => {
                mockRepository.findOne.mockResolvedValue(mockContact);

                const result = await service.findOne('test-id');

                expect(mockRepository.findOne).toHaveBeenCalledWith({
                    where: { id: 'test-id', isActive: true }
                });
                expect(result).toEqual(mockContact);
            });

            it('should throw NotFoundException if contact not found', async () => {
                mockRepository.findOne.mockResolvedValue(null);

                await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
                expect(mockRepository.findOne).toHaveBeenCalledWith({
                    where: { id: 'nonexistent-id', isActive: true }
                });
            });
        });

        describe('update', () => {
            it('should update and return a contact', async () => {
                const updateDto = {
                    fullName: 'Updated Name',
                };
                const updatedContact = { ...mockContact, ...updateDto };

                mockRepository.findOne.mockResolvedValue(mockContact);
                mockRepository.save.mockResolvedValue(updatedContact);

                const result = await service.update('test-id', updateDto);

                expect(mockRepository.findOne).toHaveBeenCalledWith({
                    where: { id: 'test-id', isActive: true }
                });
                expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
                expect(result).toEqual(updatedContact);
            });

            it('should throw NotFoundException if contact to update not found', async () => {
                mockRepository.findOne.mockResolvedValue(null);

                await expect(service.update('nonexistent-id', {})).rejects.toThrow(NotFoundException);
            });

            it('should update interestUuid field', async () => {
                const newUuid = '660e8400-e29b-41d4-a716-446655440000';
                const updateDto = {
                    interestUuid: newUuid,
                };
                const updatedContact = { ...mockContact, interestUuid: newUuid };

                mockRepository.findOne.mockResolvedValue(mockContact);
                mockRepository.save.mockResolvedValue(updatedContact);

                const result = await service.update('test-id', updateDto);

                expect(mockRepository.save).toHaveBeenCalledWith(
                    expect.objectContaining({ interestUuid: newUuid })
                );
                expect(result.interestUuid).toBe(newUuid);
            });
        });

        describe('remove', () => {
            it('should soft delete a contact by setting isActive to false', async () => {
                mockRepository.findOne.mockResolvedValue(mockContact);
                mockRepository.save.mockResolvedValue({ ...mockContact, isActive: false });

                await service.remove('test-id');

                expect(mockRepository.findOne).toHaveBeenCalledWith({
                    where: { id: 'test-id', isActive: true }
                });
                expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                    isActive: false
                }));
            });

            it('should throw NotFoundException if contact to remove not found', async () => {
                mockRepository.findOne.mockResolvedValue(null);

                await expect(service.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
            });
        });
    });
}
);