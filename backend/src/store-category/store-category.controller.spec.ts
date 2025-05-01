import { Test, TestingModule } from '@nestjs/testing';
import { StoreCategoryController } from './store-category.controller';
import { StoreCategoryService } from './store-category.service';
import { CreateStoreCategoryDto } from './dto/create-store-category.dto';
import { UpdateStoreCategoryDto } from './dto/update-store-category.dto';
import { StoreCategory } from './entities/store-category.entity';

describe('StoreCategoryController', () => {
    let controller: StoreCategoryController;
    let service: Record<keyof StoreCategoryService, jest.Mock>;

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new StoreCategoryController(service as unknown as StoreCategoryService);
    });

    it('should create a new category', async () => {
        const dto: CreateStoreCategoryDto = { name: 'Cat1', description: 'Desc' };
        const result = { id: 'c1', ...dto } as StoreCategory;
        service.create.mockResolvedValue(result);

        expect(await controller.create(dto)).toEqual(result);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should return all categories', async () => {
        const cats = [{ id: 'c2', name: 'Cat2', description: 'D' }] as StoreCategory[];
        service.findAll.mockResolvedValue(cats);

        expect(await controller.findAll()).toEqual(cats);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should return a single category', async () => {
        const cat = { id: 'c3', name: 'Cat3', description: 'D3' } as StoreCategory;
        service.findOne.mockResolvedValue(cat);

        expect(await controller.findOne('c3')).toEqual(cat);
        expect(service.findOne).toHaveBeenCalledWith('c3');
    });

    it('should update a category', async () => {
        const dto: UpdateStoreCategoryDto = { name: 'Updated' };
        const cat = { id: 'c4', name: 'Updated', description: 'D4' } as StoreCategory;
        service.update.mockResolvedValue(cat);

        expect(await controller.update('c4', dto)).toEqual(cat);
        expect(service.update).toHaveBeenCalledWith('c4', dto);
    });

    it('should remove a category', async () => {
        service.remove.mockResolvedValue(undefined);

        expect(await controller.remove('c5')).toBeUndefined();
        expect(service.remove).toHaveBeenCalledWith('c5');
    });
});
