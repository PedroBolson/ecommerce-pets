import { Test, TestingModule } from '@nestjs/testing';
import { BreedImageController } from './breed-image.controller';
import { BreedImageService } from './breed-image.service';
import { CreateBreedImageDto } from './dto/create-breed-image.dto';
import { UpdateBreedImageDto } from './dto/update-breed-image.dto';
import { BreedImage } from './entities/breed-image.entity';

describe('BreedImageController', () => {
    let controller: BreedImageController;
    let service: Record<keyof BreedImageService, jest.Mock>;

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByBreed: jest.fn(),
        };

        controller = new BreedImageController(service as unknown as BreedImageService);
    });

    it('should create a new breed image', async () => {
        const dto: CreateBreedImageDto = { url: 'u', altText: 'a', displayOrder: 1, breedId: 'b1' };
        const result = { id: 'img1', ...dto, breed: { id: 'b1' } } as unknown as BreedImage;
        service.create.mockResolvedValue(result);

        expect(await controller.create(dto)).toEqual(result);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should return all breed images', async () => {
        const images = [{ id: 'img2' }] as BreedImage[];
        service.findAll.mockResolvedValue(images);

        expect(await controller.findAll()).toEqual(images);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should return a single breed image', async () => {
        const image = { id: 'img3' } as BreedImage;
        service.findOne.mockResolvedValue(image);

        expect(await controller.findOne('img3')).toEqual(image);
        expect(service.findOne).toHaveBeenCalledWith('img3');
    });

    it('should update a breed image', async () => {
        const dto: UpdateBreedImageDto = { url: 'u2' };
        const image = { id: 'img5', url: 'u2' } as BreedImage;
        service.update.mockResolvedValue(image);

        expect(await controller.update('img5', dto)).toEqual(image);
        expect(service.update).toHaveBeenCalledWith('img5', dto);
    });

    it('should remove a breed image', async () => {
        service.remove.mockResolvedValue(undefined);

        expect(await controller.remove('img6')).toBeUndefined();
        expect(service.remove).toHaveBeenCalledWith('img6');
    });
});
