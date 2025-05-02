import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { StoreItemController } from './store-item.controller';
import { StoreItemService } from './store-item.service';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { StoreItem } from './entities/store-item.entity';

describe('StoreItemController', () => {
    let controller: StoreItemController;
    let service: Record<keyof StoreItemService, jest.Mock>;

    const mockPaginatedResponse = {
        data: [{ id: 'i1', name: 'Item 1' } as StoreItem],
        pagination: {
            total: 20,
            page: 1,
            limit: 10,
            totalPages: 2,
            hasNext: true,
            hasPrevious: false
        }
    };

    beforeEach(async () => {
        service = {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        controller = new StoreItemController(service as unknown as StoreItemService);
    });

    it('should create a new store item', async () => {
        const dto: CreateStoreItemDto = { sku: 'X', name: 'Item', price: 9.99, categoryId: 'c1' };
        const result = { id: 'i1', ...dto, stock: 0, category: { id: 'c1' }, images: [] } as unknown as StoreItem;
        service.create.mockResolvedValue(result);

        expect(await controller.create(dto)).toEqual(result);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    describe('findAll', () => {
        it('should call findAll with default pagination values when none provided', async () => {
            const result = await controller.findAll(undefined, undefined, undefined, undefined, undefined, undefined);

            expect(result).toEqual(mockPaginatedResponse);
            expect(service.findAll).toHaveBeenCalledWith({});
        });

        it('should call findAll with pagination parameters', async () => {
            const result = await controller.findAll(2, 20, undefined, undefined, undefined, undefined);

            expect(result).toEqual(mockPaginatedResponse);
            expect(service.findAll).toHaveBeenCalledWith({
                page: 2,
                limit: 20
            });
        });

        it('should call findAll with filters and pagination', async () => {
            const filters = {
                categoryId: 'c2',
                minPrice: 5.5,
                maxPrice: 20.0
            };
            const inStockStr = 'true';

            await controller.findAll(2, 20, filters.categoryId, filters.minPrice, filters.maxPrice, inStockStr);

            expect(service.findAll).toHaveBeenCalledWith({
                page: 2,
                limit: 20,
                ...filters,
                inStock: true
            });
        });

        it('should handle "false" string for inStock parameter', async () => {
            await controller.findAll(1, 10, 'c1', 10, 100, 'false');

            expect(service.findAll).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                categoryId: 'c1',
                minPrice: 10,
                maxPrice: 100,
                inStock: false
            });
        });

        it('should handle "0" string for inStock parameter', async () => {
            await controller.findAll(1, 10, undefined, undefined, undefined, '0');

            expect(service.findAll).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                inStock: false
            });
        });

        it('should handle "1" string for inStock parameter', async () => {
            await controller.findAll(1, 10, undefined, undefined, undefined, '1');

            expect(service.findAll).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                inStock: true
            });
        });

        it('should handle undefined inStock parameter', async () => {
            await controller.findAll(1, 10, 'c1', 10, 100, undefined);

            expect(service.findAll).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                categoryId: 'c1',
                minPrice: 10,
                maxPrice: 100
            });
        });

        it('should handle errors for invalid parameters', async () => {
            const mockError = new Error('Test error');
            service.findAll.mockRejectedValueOnce(mockError);

            await expect(controller.findAll('invalid' as any, 10, 'c1', 10, 100, '1'))
                .rejects.toThrow('Test error');
        });

        it('should handle edge cases like page=0', async () => {
            await controller.findAll(0, 10, undefined, undefined, undefined, undefined);

            expect(service.findAll).toHaveBeenCalledWith({
                page: 0,
                limit: 10
            });
        });
    });

    it('should return a single store item', async () => {
        const item = { id: 'i3' } as StoreItem;
        service.findOne.mockResolvedValue(item);

        expect(await controller.findOne('i3')).toEqual(item);
        expect(service.findOne).toHaveBeenCalledWith('i3');
    });

    describe('findOne', () => {
        it('should propagate errors from service layer', async () => {
            const mockError = new Error('Service error');
            service.findOne.mockRejectedValueOnce(mockError);

            await expect(controller.findOne('not-a-uuid'))
                .rejects.toThrow('Service error');
        });
    });

    it('should update a store item', async () => {
        const dto: UpdateStoreItemDto = { name: 'NewName' };
        const item = { id: 'i4', name: 'NewName' } as StoreItem;
        service.update.mockResolvedValue(item);

        expect(await controller.update('i4', dto)).toEqual(item);
        expect(service.update).toHaveBeenCalledWith('i4', dto);
    });

    describe('update', () => {
        it('should handle empty update dto', async () => {
            const emptyDto = {};
            service.update.mockResolvedValue({ id: 'i4' } as StoreItem);

            await controller.update('i4', emptyDto);
            expect(service.update).toHaveBeenCalledWith('i4', emptyDto);
        });
    });

    it('should remove a store item', async () => {
        service.remove.mockResolvedValue(undefined);

        expect(await controller.remove('i5')).toBeUndefined();
        expect(service.remove).toHaveBeenCalledWith('i5');
    });

    describe('remove', () => {
        it('should handle errors from service layer', async () => {
            const mockError = new Error('Item not found');
            service.remove.mockRejectedValue(mockError);

            await expect(controller.remove('non-existent-id'))
                .rejects.toThrow('Item not found');
        });
    });
});
