import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreItemService } from './store-item.service';
import { StoreItem } from './entities/store-item.entity';
import { StoreCategory } from '../store-category/entities/store-category.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';

describe('StoreItemService', () => {
    let service: StoreItemService;
    let itemRepo: Repository<StoreItem>;
    let categoryRepo: Repository<StoreCategory>;
    let queryBuilder: any;

    beforeEach(async () => {
        queryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockResolvedValue(0),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StoreItemService,
                {
                    provide: getRepositoryToken(StoreItem),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
                    },
                },
                {
                    provide: getRepositoryToken(StoreCategory),
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<StoreItemService>(StoreItemService);
        itemRepo = module.get<Repository<StoreItem>>(getRepositoryToken(StoreItem));
        categoryRepo = module.get<Repository<StoreCategory>>(getRepositoryToken(StoreCategory));
    });

    describe('create', () => {
        it('should create a new item when category exists', async () => {
            const dto: CreateStoreItemDto = { sku: 'X1', name: 'Item1', price: 10, categoryId: 'c1' };
            const category = { id: 'c1' } as StoreCategory;
            const item = { id: 'i1', ...dto, stock: 0, category, images: [] } as StoreItem;

            jest.spyOn(categoryRepo, 'findOneBy').mockResolvedValue(category);
            jest.spyOn(itemRepo, 'create').mockReturnValue(item as any);
            jest.spyOn(itemRepo, 'save').mockResolvedValue(item as any);

            const result = await service.create(dto);

            expect(categoryRepo.findOneBy).toHaveBeenCalledWith({ id: dto.categoryId });
            expect(itemRepo.create).toHaveBeenCalledWith({
                sku: dto.sku,
                name: dto.name,
                description: undefined,
                price: dto.price,
                stock: 0,
                category,
            });
            expect(itemRepo.save).toHaveBeenCalledWith(item);
            expect(result).toEqual(item);
        });

        it('should throw NotFoundException if category not found', async () => {
            const dto: CreateStoreItemDto = { sku: 'X2', name: 'Item2', price: 20, categoryId: 'bad' };
            jest.spyOn(categoryRepo, 'findOneBy').mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        // Setup mock data for pagination tests
        const items = [
            { id: 'it1', name: 'Item 1' } as StoreItem,
            { id: 'it2', name: 'Item 2' } as StoreItem
        ];

        beforeEach(() => {
            // Reset mocks for pagination tests
            jest.spyOn(queryBuilder, 'getMany').mockResolvedValue(items);
            jest.spyOn(queryBuilder, 'getCount').mockResolvedValue(20); // Total of 20 items
        });

        it('should return paginated items with default pagination', async () => {
            const result = await service.findAll({});

            // Check returned structure has data and pagination
            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('pagination');
            expect(result.data).toEqual(items);
            expect(result.pagination).toEqual({
                total: 20,
                page: 1,
                limit: 8,  // Changed from 10 to 8
                totalPages: 3,
                hasNext: true,
                hasPrevious: false
            });

            // Check pagination methods were called
            expect(queryBuilder.skip).toHaveBeenCalledWith(0);
            expect(queryBuilder.take).toHaveBeenCalledWith(8);  // Changed from 10 to 8
        });

        it('should use custom pagination parameters', async () => {
            const result = await service.findAll({ page: 2, limit: 5 });

            // Check pagination calculations
            expect(queryBuilder.skip).toHaveBeenCalledWith(5); // (page-1) * limit
            expect(queryBuilder.take).toHaveBeenCalledWith(5);
            expect(result.pagination).toEqual({
                total: 20,
                page: 2,
                limit: 5,
                totalPages: 4,
                hasNext: true,
                hasPrevious: true
            });
        });

        it('should calculate pagination metadata correctly for last page', async () => {
            const result = await service.findAll({ page: 4, limit: 5 });

            expect(result.pagination).toEqual({
                total: 20,
                page: 4,
                limit: 5,
                totalPages: 4,
                hasNext: false,
                hasPrevious: true
            });
        });

        it('should apply filters with pagination', async () => {
            await service.findAll({
                page: 2,
                limit: 10,
                categoryId: 'c1',
                minPrice: 50,
                maxPrice: 200,
                inStock: true
            });

            // Check filters are applied
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('category.id = :categoryId', { categoryId: 'c1' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('item.price >= :minPrice', { minPrice: 50 });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('item.price <= :maxPrice', { maxPrice: 200 });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('item.stock > 0');

            // And pagination is also applied
            expect(queryBuilder.skip).toHaveBeenCalledWith(10); // (2-1) * 10
            expect(queryBuilder.take).toHaveBeenCalledWith(10);
        });

        it('should handle inStock=false filter', async () => {
            await service.findAll({ inStock: false });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('item.stock = 0');
        });

        it('should handle extreme pagination cases', async () => {
            // Test page number higher than total pages
            jest.spyOn(queryBuilder, 'getCount').mockResolvedValueOnce(10);
            const result = await service.findAll({ page: 100, limit: 10 });

            // Should still work and show no results with correct pagination metadata
            expect(result.pagination.totalPages).toBe(1);
            expect(result.pagination.hasNext).toBe(false);
            expect(result.pagination.hasPrevious).toBe(true);
        });
    });

    describe('findOne', () => {
        it('should return item when found', async () => {
            const item = { id: 'f1' } as StoreItem;
            jest.spyOn(itemRepo, 'findOne').mockResolvedValue(item);

            const result = await service.findOne('f1');
            expect(itemRepo.findOne).toHaveBeenCalledWith({ where: { id: 'f1' }, relations: ['category', 'images'] });
            expect(result).toEqual(item);
        });

        it('should throw NotFoundException when not found', async () => {
            jest.spyOn(itemRepo, 'findOne').mockResolvedValue(null);
            await expect(service.findOne('bad')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update item properties and save', async () => {
            const existing = { id: 'u1', sku: 'old', name: 'old', description: 'old', price: 10, stock: 1, category: { id: 'c1' } } as StoreItem;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            const dto: UpdateStoreItemDto = { name: 'new', price: 15, stock: 5 };
            jest.spyOn(itemRepo, 'save').mockResolvedValue({ ...existing, ...dto } as StoreItem);

            const result = await service.update('u1', dto);
            expect(service.findOne).toHaveBeenCalledWith('u1');
            expect(itemRepo.save).toHaveBeenCalledWith({ ...existing, ...dto });
            expect(result.name).toBe('new');
        });

        it('should change category if categoryId provided', async () => {
            const existing = { id: 'u2', sku: '', name: '', description: '', price: 0, stock: 0, category: { id: 'c1' } } as StoreItem;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            const newCategory = { id: 'c2' } as StoreCategory;
            jest.spyOn(categoryRepo, 'findOneBy').mockResolvedValue(newCategory);
            jest.spyOn(itemRepo, 'save').mockResolvedValue({ ...existing, category: newCategory } as StoreItem);

            const result = await service.update('u2', { categoryId: 'c2' });
            expect(categoryRepo.findOneBy).toHaveBeenCalledWith({ id: 'c2' });
            expect(itemRepo.save).toHaveBeenCalledWith({ ...existing, category: newCategory });
            expect(result.category).toEqual(newCategory);
        });

        it('should throw NotFoundException if new category not found', async () => {
            const existing = { id: 'u3', sku: '', name: '', description: '', price: 0, stock: 0, category: { id: 'c1' } } as StoreItem;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            jest.spyOn(categoryRepo, 'findOneBy').mockResolvedValue(null);
            await expect(service.update('u3', { categoryId: 'bad' })).rejects.toThrow(NotFoundException);
        });

        it('should not call category repo if categoryId is same as current', async () => {
            const existing = { id: 'u4', category: { id: 'c1' } } as StoreItem;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            jest.spyOn(itemRepo, 'save').mockResolvedValue(existing);

            await service.update('u4', { categoryId: 'c1' });

            // Category repo should not be called since ID is the same
            expect(categoryRepo.findOneBy).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('should remove the item', async () => {
            const existing = { id: 'r1' } as StoreItem;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            jest.spyOn(itemRepo, 'remove').mockResolvedValue(existing as any);

            const result = await service.remove('r1');
            expect(service.findOne).toHaveBeenCalledWith('r1');
            expect(itemRepo.remove).toHaveBeenCalledWith(existing);
            expect(result).toBeUndefined();
        });
    });
});
