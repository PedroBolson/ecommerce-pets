import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PetKnowledgeService } from './pet-knowledge.service';
import { PetKnowledge } from './entities/pet-knowledge.entity';
import { Breed } from '../breed/entities/breed.entity';
import { CreatePetKnowledgeDto } from './dto/create-pet-knowledge.dto';
import { UpdatePetKnowledgeDto } from './dto/update-pet-knowledge.dto';

describe('PetKnowledgeService', () => {
    let service: PetKnowledgeService;
    let petKnowledgeRepository: Repository<PetKnowledge>;
    let breedRepository: Repository<Breed>;

    const mockPetKnowledge = {
        id: 'test-id',
        title: 'Test Title',
        summary: 'Test Summary',
        content: 'Test Content',
        imageUrl: 'https://example.com/image.jpg',
        category: 'Test Category',
        createdAt: new Date(),
        isActive: true,
        breed: undefined,
    } as PetKnowledge;

    const mockBreed = { id: 'breed-id', name: 'Test Breed' } as Breed;

    const mockPetKnowledgeRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        createQueryBuilder: jest.fn(),
    };
    const mockBreedRepository = { findOne: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PetKnowledgeService,
                {
                    provide: getRepositoryToken(PetKnowledge),
                    useValue: mockPetKnowledgeRepository,
                },
                {
                    provide: getRepositoryToken(Breed),
                    useValue: mockBreedRepository,
                },
            ],
        }).compile();

        service = module.get<PetKnowledgeService>(PetKnowledgeService);
        petKnowledgeRepository = module.get<Repository<PetKnowledge>>(getRepositoryToken(PetKnowledge));
        breedRepository = module.get<Repository<Breed>>(getRepositoryToken(Breed));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create article without breed', async () => {
            const dto: CreatePetKnowledgeDto = {
                title: 'Test Title',
                summary: 'Test Summary',
                content: 'Test Content',
                imageUrl: 'https://example.com/image.jpg',
                category: 'Test Category',
            };
            mockPetKnowledgeRepository.create.mockReturnValue(mockPetKnowledge);
            mockPetKnowledgeRepository.save.mockResolvedValue(mockPetKnowledge);

            const result = await service.create(dto);

            expect(petKnowledgeRepository.create).toHaveBeenCalledWith(dto);
            expect(petKnowledgeRepository.save).toHaveBeenCalledWith(mockPetKnowledge);
            expect(result).toEqual(mockPetKnowledge);
        });

        it('should create article with breed', async () => {
            const dto: CreatePetKnowledgeDto = {
                title: 'Test Title',
                summary: 'Test Summary',
                content: 'Test Content',
                imageUrl: 'https://example.com/image.jpg',
                category: 'Test Category',
                breedId: 'breed-id',
            };
            mockPetKnowledgeRepository.create.mockReturnValue({ ...mockPetKnowledge });
            mockBreedRepository.findOne.mockResolvedValue(mockBreed);
            mockPetKnowledgeRepository.save.mockResolvedValue({ ...mockPetKnowledge, breed: mockBreed });

            const result = await service.create(dto);

            expect(breedRepository.findOne).toHaveBeenCalledWith({ where: { id: 'breed-id' } });
            expect(petKnowledgeRepository.save).toHaveBeenCalled();
            expect(result).toEqual({ ...mockPetKnowledge, breed: mockBreed });
        });

        it('should throw if breed not found', async () => {
            const dto: CreatePetKnowledgeDto = {
                title: 'Test Title',
                summary: 'Test Summary',
                content: 'Test Content',
                imageUrl: 'https://example.com/image.jpg',
                category: 'Test Category',
                breedId: 'non-existent',
            };
            mockPetKnowledgeRepository.create.mockReturnValue({ ...mockPetKnowledge });
            mockBreedRepository.findOne.mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
            expect(petKnowledgeRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('findAll (simple)', () => {
        beforeEach(() => {
            // Configurar createQueryBuilder para retornar undefined - forçando o uso do método find()
            mockPetKnowledgeRepository.createQueryBuilder.mockReturnValue(undefined);
        });

        it('should return all articles', async () => {
            mockPetKnowledgeRepository.find.mockResolvedValue([mockPetKnowledge]);

            const result = (await service.findAll({})) as PetKnowledge[];
            expect(petKnowledgeRepository.find).toHaveBeenCalledWith({
                where: {},
                relations: ['breed'],
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual([mockPetKnowledge]);
        });

        it('should filter by category', async () => {
            mockPetKnowledgeRepository.find.mockResolvedValue([mockPetKnowledge]);

            const result = (await service.findAll({ category: 'Test Category' })) as PetKnowledge[];
            expect(petKnowledgeRepository.find).toHaveBeenCalledWith({
                where: { category: 'Test Category' },
                relations: ['breed'],
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual([mockPetKnowledge]);
        });
    });

    describe('findAll (pagination)', () => {
        let mockQB: any;
        beforeEach(() => {
            mockQB = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn(),
            };
            // assign directly so createQueryBuilder exists
            (petKnowledgeRepository as any).createQueryBuilder = jest.fn().mockReturnValue(mockQB);
        });

        it('uses default pagination', async () => {
            const data = [{ id: '1' }] as PetKnowledge[];
            mockQB.getManyAndCount.mockResolvedValue([data, 15]);

            const result = (await service.findAll({})) as { data: PetKnowledge[]; pagination: any };
            expect(mockQB.skip).toHaveBeenCalledWith(0);
            expect(mockQB.take).toHaveBeenCalledWith(3);  // Changed from 10 to 3
            expect(result).toEqual({
                data,
                pagination: {
                    total: 15,
                    page: 1,
                    limit: 3,  // Changed from 10 to 3
                    totalPages: 5,  // Changed from 2 to 5 (15/3=5)
                    hasNext: true,
                    hasPrevious: false
                },
            });
        });

        it('respects custom pagination and category', async () => {
            const data = [{ id: '1' }] as PetKnowledge[];
            mockQB.getManyAndCount.mockResolvedValue([data, 25]);

            const result = (await service.findAll({ page: 2, limit: 5, category: 'Health' })) as { data: PetKnowledge[]; pagination: any };
            expect(mockQB.andWhere).toHaveBeenCalledWith(
                'petKnowledge.category = :category',
                { category: 'Health' }
            );
            expect(mockQB.skip).toHaveBeenCalledWith(5);
            expect(mockQB.take).toHaveBeenCalledWith(5);
            expect(result.pagination).toEqual({ total: 25, page: 2, limit: 5, totalPages: 5, hasNext: true, hasPrevious: true });
        });
    });

    describe('findOne', () => {
        it('returns an article', async () => {
            mockPetKnowledgeRepository.findOne.mockResolvedValue(mockPetKnowledge);
            const result = await service.findOne('test-id');
            expect(petKnowledgeRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test-id' },
                relations: ['breed'],
            });
            expect(result).toEqual(mockPetKnowledge);
        });

        // Other tests remain unchanged
        it('throws if not found', async () => {
            mockPetKnowledgeRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('updates fields', async () => {
            const updated = { ...mockPetKnowledge, title: 'New' };
            mockPetKnowledgeRepository.findOne.mockResolvedValue(mockPetKnowledge);
            mockPetKnowledgeRepository.save.mockResolvedValue(updated);
            const result = await service.update('test-id', { title: 'New' });
            expect(result).toEqual(updated);
        });

        it('updates breed', async () => {
            const updated = { ...mockPetKnowledge, breed: mockBreed };
            mockPetKnowledgeRepository.findOne.mockResolvedValue(mockPetKnowledge);
            mockBreedRepository.findOne.mockResolvedValue(mockBreed);
            mockPetKnowledgeRepository.save.mockResolvedValue(updated);
            const result = await service.update('test-id', { breedId: 'breed-id' });
            expect(result).toEqual(updated);
        });

        it('removes breed when null', async () => {
            const withBreed = { ...mockPetKnowledge, breed: mockBreed };
            mockPetKnowledgeRepository.findOne.mockResolvedValue(withBreed);
            mockPetKnowledgeRepository.save.mockResolvedValue({ ...withBreed, breed: undefined });
            const result = await service.update('test-id', { breedId: undefined });
            expect(result.breed).toBeUndefined();
        });

        it('throws if not found', async () => {
            mockPetKnowledgeRepository.findOne.mockResolvedValue(null);
            await expect(service.update('x', { title: 'New' })).rejects.toThrow(NotFoundException);
        });

        it('throws if breed missing', async () => {
            mockPetKnowledgeRepository.findOne.mockResolvedValue(mockPetKnowledge);
            mockBreedRepository.findOne.mockResolvedValue(null);
            await expect(service.update('test-id', { breedId: 'no' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('deletes article from database', async () => {
            mockPetKnowledgeRepository.findOne.mockResolvedValue(mockPetKnowledge);
            mockPetKnowledgeRepository.remove = jest.fn().mockResolvedValue(mockPetKnowledge);

            await service.remove('test-id');

            expect(petKnowledgeRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test-id' },
                relations: ['breed'],
            });
            expect(petKnowledgeRepository.remove).toHaveBeenCalledWith(mockPetKnowledge);
        });

        it('throws if not found', async () => {
            mockPetKnowledgeRepository.findOne.mockResolvedValue(null);
            await expect(service.remove('x')).rejects.toThrow(NotFoundException);
        });
    });
});
