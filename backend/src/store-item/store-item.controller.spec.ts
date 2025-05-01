import { Test, TestingModule } from '@nestjs/testing';
import { StoreItemController } from './store-item.controller';
import { StoreItemService } from './store-item.service';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { StoreItem } from './entities/store-item.entity';

describe('StoreItemController', () => {
    let controller: StoreItemController;
    let service: Record<keyof StoreItemService, jest.Mock>;

    beforeEach(async () => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
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
        it('should call findAll without filters', async () => {
            const items: StoreItem[] = [];
            service.findAll.mockResolvedValue(items);

            expect(await controller.findAll(undefined, undefined, undefined, undefined)).toEqual(items);
            expect(service.findAll).toHaveBeenCalledWith({});
        });

        it('should call findAll with filters', async () => {
            const items: StoreItem[] = [{ id: 'i2' } as StoreItem];
            service.findAll.mockResolvedValue(items);

            const filters = { categoryId: 'c2', minPrice: 5.5, maxPrice: 20.0, inStock: true };
            expect(await controller.findAll(filters.categoryId, filters.minPrice, filters.maxPrice, filters.inStock)).toEqual(items);
            expect(service.findAll).toHaveBeenCalledWith(filters);
        });
    });

    it('should return a single store item', async () => {
        const item = { id: 'i3' } as StoreItem;
        service.findOne.mockResolvedValue(item);

        expect(await controller.findOne('i3')).toEqual(item);
        expect(service.findOne).toHaveBeenCalledWith('i3');
    });

    it('should update a store item', async () => {
        const dto: UpdateStoreItemDto = { name: 'NewName' };
        const item = { id: 'i4', name: 'NewName' } as StoreItem;
        service.update.mockResolvedValue(item);

        expect(await controller.update('i4', dto)).toEqual(item);
        expect(service.update).toHaveBeenCalledWith('i4', dto);
    });

    it('should remove a store item', async () => {
        service.remove.mockResolvedValue(undefined);

        expect(await controller.remove('i5')).toBeUndefined();
        expect(service.remove).toHaveBeenCalledWith('i5');
    });
});
