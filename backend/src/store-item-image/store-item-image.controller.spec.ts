import { Test, TestingModule } from '@nestjs/testing';
import { StoreItemImageController } from './store-item-image.controller';
import { StoreItemImageService } from './store-item-image.service';
import { CreateStoreItemImageDto } from './dto/create-store-item-image.dto';
import { UpdateStoreItemImageDto } from './dto/update-store-item-image.dto';
import { StoreItemImage } from './entities/store-item-image.entity';
import { StoreItem } from '../store-item/entities/store-item.entity';

describe('StoreItemImageController', () => {
    let controller: StoreItemImageController;
    let service: Partial<Record<keyof StoreItemImageService, jest.Mock>>;

    beforeEach(async () => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findByItem: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        controller = new StoreItemImageController(service as unknown as StoreItemImageService);
    });

    it('should create a new store item image', async () => {
        const dto: CreateStoreItemImageDto = { url: 'u', altText: 'a', displayOrder: 1, itemId: 'i1' };
        const result = { id: 'img1', ...dto, item: { id: 'i1' } as StoreItem } as StoreItemImage;
        service.create!.mockResolvedValue(result);

        expect(await controller.create(dto)).toEqual(result);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should return all store item images', async () => {
        const images = [{ id: 'img2' }] as StoreItemImage[];
        service.findAll!.mockResolvedValue(images);

        expect(await controller.findAll()).toEqual(images);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should return images by item', async () => {
        const images = [{ id: 'img3' }] as StoreItemImage[];
        service.findByItem!.mockResolvedValue(images);

        expect(await controller.findByItem('i2')).toEqual(images);
        expect(service.findByItem).toHaveBeenCalledWith('i2');
    });

    it('should return a single store item image', async () => {
        const image = { id: 'img4' } as StoreItemImage;
        service.findOne!.mockResolvedValue(image);

        expect(await controller.findOne('img4')).toEqual(image);
        expect(service.findOne).toHaveBeenCalledWith('img4');
    });

    it('should update a store item image', async () => {
        const dto: UpdateStoreItemImageDto = { url: 'u2' };
        const image = { id: 'img5', url: 'u2' } as StoreItemImage;
        service.update!.mockResolvedValue(image);

        expect(await controller.update('img5', dto)).toEqual(image);
        expect(service.update).toHaveBeenCalledWith('img5', dto);
    });

    it('should remove a store item image', async () => {
        service.remove!.mockResolvedValue(undefined);

        expect(await controller.remove('img6')).toBeUndefined();
        expect(service.remove).toHaveBeenCalledWith('img6');
    });
});
