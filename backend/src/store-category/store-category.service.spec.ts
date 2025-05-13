import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { StoreCategoryService } from './store-category.service';
import { StoreCategory } from './entities/store-category.entity';
import { CreateStoreCategoryDto } from './dto/create-store-category.dto';
import { UpdateStoreCategoryDto } from './dto/update-store-category.dto';

describe('StoreCategoryService', () => {
    let service: StoreCategoryService;
    let repository: Repository<StoreCategory>;

    const mockCategory = {
        id: 'category-id',
        name: 'Dog Food',
        description: 'Premium quality food for dogs of all sizes',
        items: [],
    };

    const mockRepository = () => ({
        create: jest.fn().mockReturnValue(mockCategory),
        save: jest.fn().mockResolvedValue(mockCategory),
        find: jest.fn().mockResolvedValue([mockCategory]),
        findOne: jest.fn().mockResolvedValue(mockCategory),
        remove: jest.fn().mockResolvedValue(true),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StoreCategoryService,
                {
                    provide: getRepositoryToken(StoreCategory),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<StoreCategoryService>(StoreCategoryService);
        repository = module.get<Repository<StoreCategory>>(getRepositoryToken(StoreCategory));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new category', async () => {
            const createCategoryDto: CreateStoreCategoryDto = {
                name: 'Dog Food',
                description: 'Premium quality food for dogs of all sizes',
            };

            const result = await service.create(createCategoryDto);

            expect(repository.create).toHaveBeenCalledWith(createCategoryDto);
            expect(repository.save).toHaveBeenCalled();
            expect(result).toEqual(mockCategory);
        });

        it('should create a category with minimal data', async () => {
            const createCategoryDto: CreateStoreCategoryDto = {
                name: 'Dog Food',
            };

            await service.create(createCategoryDto);

            expect(repository.create).toHaveBeenCalledWith(createCategoryDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of categories with their items', async () => {
            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalledWith({
                relations: ['items'],
            });
            expect(result).toEqual([mockCategory]);
        });

        it('should return an empty array when no categories are found', async () => {
            jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a specific category by ID with its items', async () => {
            const result = await service.findOne('category-id');

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: 'category-id' },
                relations: ['items'],
            });
            expect(result).toEqual(mockCategory);
        });

        it('should throw NotFoundException when category is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

            await expect(service.findOne('non-existent-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            const updateCategoryDto: UpdateStoreCategoryDto = {
                description: 'Updated description for premium dog food',
            };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockCategory);

            const result = await service.update('category-id', updateCategoryDto);

            expect(service.findOne).toHaveBeenCalledWith('category-id');
            expect(repository.save).toHaveBeenCalledWith({
                ...mockCategory,
                ...updateCategoryDto,
            });
            expect(result).toEqual(mockCategory);
        });

        it('should validate the category exists before updating', async () => {
            const updateCategoryDto: UpdateStoreCategoryDto = { name: 'New Name' };

            jest.spyOn(service, 'findOne').mockImplementation(async (id) => {
                if (id === 'invalid-id') {
                    throw new NotFoundException(`Store category with ID ${id} not found`);
                }
                return mockCategory;
            });

            await expect(service.update('invalid-id', updateCategoryDto)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('remove', () => {
        it('should remove a category', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockCategory);

            await service.remove('category-id');

            expect(service.findOne).toHaveBeenCalledWith('category-id');
            expect(repository.remove).toHaveBeenCalledWith(mockCategory);
        });

        it('should validate the category exists before removing', async () => {
            jest.spyOn(service, 'findOne').mockImplementationOnce(async (id) => {
                throw new NotFoundException(`Store category with ID ${id} not found`);
            });

            await expect(service.remove('invalid-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});