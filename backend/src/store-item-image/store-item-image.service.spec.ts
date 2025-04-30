import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreItemImageService } from './store-item-image.service';
import { StoreItemImage } from './entities/store-item-image.entity';
import { StoreItem } from '../store-item/entities/store-item.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateStoreItemImageDto } from './dto/create-store-item-image.dto';
import { UpdateStoreItemImageDto } from './dto/update-store-item-image.dto';

describe('StoreItemImageService', () => {
    let service: StoreItemImageService;
    let imageRepo: Repository<StoreItemImage>;
    let itemRepo: Repository<StoreItem>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StoreItemImageService,
                {
                    provide: getRepositoryToken(StoreItemImage),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(StoreItem),
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<StoreItemImageService>(StoreItemImageService);
        imageRepo = module.get<Repository<StoreItemImage>>(getRepositoryToken(StoreItemImage));
        itemRepo = module.get<Repository<StoreItem>>(getRepositoryToken(StoreItem));
    });

    describe('create', () => {
        it('should create a new image when item exists', async () => {
            const dto: CreateStoreItemImageDto = { url: 'url', altText: 'alt', displayOrder: 1, itemId: 'i1' };
            const item = { id: 'i1' } as StoreItem;
            const image = { id: 'img1', ...dto, item } as StoreItemImage;

            jest.spyOn(itemRepo, 'findOneBy').mockResolvedValue(item);
            jest.spyOn(imageRepo, 'create').mockReturnValue(image as any);
            jest.spyOn(imageRepo, 'save').mockResolvedValue(image as any);

            const result = await service.create(dto);

            expect(itemRepo.findOneBy).toHaveBeenCalledWith({ id: dto.itemId });
            expect(imageRepo.create).toHaveBeenCalledWith({ url: dto.url, altText: dto.altText, displayOrder: dto.displayOrder, item });
            expect(imageRepo.save).toHaveBeenCalledWith(image);
            expect(result).toEqual(image);
        });

        it('should throw NotFoundException if item not found', async () => {
            const dto: CreateStoreItemImageDto = { url: 'url', altText: 'alt', displayOrder: 0, itemId: 'bad' };
            jest.spyOn(itemRepo, 'findOneBy').mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return all images with relations', async () => {
            const images = [{ id: 'im1' } as StoreItemImage];
            jest.spyOn(imageRepo, 'find').mockResolvedValue(images);

            const result = await service.findAll();
            expect(imageRepo.find).toHaveBeenCalledWith({ relations: ['item'] });
            expect(result).toEqual(images);
        });
    });

    describe('findByItem', () => {
        it('should return images for specific item ordered', async () => {
            const images = [{ id: 'im2' } as StoreItemImage];
            jest.spyOn(imageRepo, 'find').mockResolvedValue(images);

            const result = await service.findByItem('i2');
            expect(imageRepo.find).toHaveBeenCalledWith({ where: { item: { id: 'i2' } }, order: { displayOrder: 'ASC' } });
            expect(result).toEqual(images);
        });
    });

    describe('findOne', () => {
        it('should return image when found', async () => {
            const image = { id: 'im3' } as StoreItemImage;
            jest.spyOn(imageRepo, 'findOne').mockResolvedValue(image);

            const result = await service.findOne('im3');
            expect(imageRepo.findOne).toHaveBeenCalledWith({ where: { id: 'im3' }, relations: ['item'] });
            expect(result).toEqual(image);
        });

        it('should throw NotFoundException when not found', async () => {
            jest.spyOn(imageRepo, 'findOne').mockResolvedValue(null);
            await expect(service.findOne('bad')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update fields and save', async () => {
            const existing = { id: 'u1', url: 'old', altText: 'old', displayOrder: 0, item: { id: 'i1' } } as StoreItemImage;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            const dto: UpdateStoreItemImageDto = { url: 'new', altText: 'new', displayOrder: 2 };
            jest.spyOn(imageRepo, 'save').mockResolvedValue({ ...existing, ...dto } as StoreItemImage);

            const result = await service.update('u1', dto);
            expect(service.findOne).toHaveBeenCalledWith('u1');
            expect(imageRepo.save).toHaveBeenCalledWith({ ...existing, ...dto });
            expect(result.url).toBe('new');
        });

        it('should change item if itemId provided', async () => {
            const existing = { id: 'u2', url: '', altText: '', displayOrder: 0, item: { id: 'i1' } } as StoreItemImage;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            const newItem = { id: 'i2' } as StoreItem;
            jest.spyOn(itemRepo, 'findOneBy').mockResolvedValue(newItem);
            jest.spyOn(imageRepo, 'save').mockResolvedValue({ ...existing, item: newItem } as StoreItemImage);

            const result = await service.update('u2', { itemId: 'i2' });
            expect(itemRepo.findOneBy).toHaveBeenCalledWith({ id: 'i2' });
            expect(imageRepo.save).toHaveBeenCalledWith({ ...existing, item: newItem });
            expect(result.item).toEqual(newItem);
        });

        it('should throw NotFoundException if new item not found', async () => {
            const existing = { id: 'u3', url: '', altText: '', displayOrder: 0, item: { id: 'i1' } } as StoreItemImage;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            jest.spyOn(itemRepo, 'findOneBy').mockResolvedValue(null);
            await expect(service.update('u3', { itemId: 'bad' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove the image', async () => {
            const existing = { id: 'r1' } as StoreItemImage;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            jest.spyOn(imageRepo, 'remove').mockResolvedValue(existing as any);

            const result = await service.remove('r1');
            expect(service.findOne).toHaveBeenCalledWith('r1');
            expect(imageRepo.remove).toHaveBeenCalledWith(existing);
            expect(result).toBeUndefined();
        });
    });
});
