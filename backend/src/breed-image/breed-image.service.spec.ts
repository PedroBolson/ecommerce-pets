import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BreedImageService } from './breed-image.service';
import { BreedImage } from './entities/breed-image.entity';
import { Breed } from '../breed/entities/breed.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateBreedImageDto } from './dto/create-breed-image.dto';
import { UpdateBreedImageDto } from './dto/update-breed-image.dto';

describe('BreedImageService', () => {
    let service: BreedImageService;
    let imageRepo: Repository<BreedImage>;
    let breedRepo: Repository<Breed>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BreedImageService,
                {
                    provide: getRepositoryToken(BreedImage),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Breed),
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<BreedImageService>(BreedImageService);
        imageRepo = module.get<Repository<BreedImage>>(getRepositoryToken(BreedImage));
        breedRepo = module.get<Repository<Breed>>(getRepositoryToken(Breed));
    });

    describe('create', () => {
        it('should create a new breed image when breed exists', async () => {
            const dto: CreateBreedImageDto = { url: 'url', altText: 'alt', displayOrder: 1, breedId: 'b1' };
            const breed = { id: 'b1' } as Breed;
            const image = { id: 'img1', url: dto.url, altText: dto.altText, displayOrder: dto.displayOrder, breed } as BreedImage;

            jest.spyOn(breedRepo, 'findOneBy').mockResolvedValue(breed);
            jest.spyOn(imageRepo, 'create').mockReturnValue(image as any);
            jest.spyOn(imageRepo, 'save').mockResolvedValue(image as any);

            const result = await service.create(dto);

            expect(breedRepo.findOneBy).toHaveBeenCalledWith({ id: dto.breedId });
            expect(imageRepo.create).toHaveBeenCalledWith({ url: dto.url, altText: dto.altText, displayOrder: dto.displayOrder, breed });
            expect(imageRepo.save).toHaveBeenCalledWith(image);
            expect(result).toEqual(image);
        });

        it('should throw NotFoundException if breed not found', async () => {
            const dto: CreateBreedImageDto = { url: 'url', altText: 'alt', displayOrder: 0, breedId: 'bad' };
            jest.spyOn(breedRepo, 'findOneBy').mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
            expect(breedRepo.findOneBy).toHaveBeenCalledWith({ id: dto.breedId });
        });
    });

    describe('findAll', () => {
        it('should return all breed images with relations', async () => {
            const images = [{ id: 'i1' } as BreedImage];
            jest.spyOn(imageRepo, 'find').mockResolvedValue(images);

            const result = await service.findAll();
            expect(imageRepo.find).toHaveBeenCalledWith({ relations: ['breed'] });
            expect(result).toEqual(images);
        });
    });

    describe('findByBreed', () => {
        it('should return images for specific breed ordered', async () => {
            const images = [{ id: 'i2' } as BreedImage];
            jest.spyOn(imageRepo, 'find').mockResolvedValue(images);

            const result = await service.findByBreed('b2');
            expect(imageRepo.find).toHaveBeenCalledWith({ where: { breed: { id: 'b2' } }, order: { displayOrder: 'ASC' } });
            expect(result).toEqual(images);
        });
    });

    describe('findOne', () => {
        it('should return an image when found', async () => {
            const image = { id: 'i3' } as BreedImage;
            jest.spyOn(imageRepo, 'findOne').mockResolvedValue(image);

            const result = await service.findOne('i3');
            expect(imageRepo.findOne).toHaveBeenCalledWith({ where: { id: 'i3' }, relations: ['breed'] });
            expect(result).toEqual(image);
        });

        it('should throw NotFoundException when not found', async () => {
            jest.spyOn(imageRepo, 'findOne').mockResolvedValue(null);
            await expect(service.findOne('bad')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update fields and save', async () => {
            const existing = { id: 'u1', url: 'old', altText: 'old', displayOrder: 0, breed: { id: 'b1' } } as any as BreedImage;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);

            const dto: UpdateBreedImageDto = { url: 'new', altText: 'new', displayOrder: 2 };
            jest.spyOn(imageRepo, 'save').mockResolvedValue({ ...existing, ...dto } as BreedImage);

            const result = await service.update('u1', dto);
            expect(service.findOne).toHaveBeenCalledWith('u1');
            expect(imageRepo.save).toHaveBeenCalledWith({ ...existing, ...dto });
            expect(result.url).toBe('new');
        });

        it('should change breed if breedId provided', async () => {
            const existing = { id: 'u2', url: '', altText: '', displayOrder: 0, breed: { id: 'b1' } } as BreedImage;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);

            const newBreed = { id: 'b2' } as Breed;
            const dto: UpdateBreedImageDto = { breedId: 'b2' };
            jest.spyOn(breedRepo, 'findOneBy').mockResolvedValue(newBreed);
            jest.spyOn(imageRepo, 'save').mockResolvedValue({ ...existing, breed: newBreed } as BreedImage);

            const result = await service.update('u2', dto);
            expect(breedRepo.findOneBy).toHaveBeenCalledWith({ id: 'b2' });
            expect(imageRepo.save).toHaveBeenCalledWith({ ...existing, breed: newBreed });
            expect(result.breed).toEqual(newBreed);
        });

        it('should throw NotFoundException if new breed not found', async () => {
            const existing = { id: 'u3', url: '', altText: '', displayOrder: 0, breed: { id: 'b1' } } as BreedImage;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);

            jest.spyOn(breedRepo, 'findOneBy').mockResolvedValue(null);
            await expect(service.update('u3', { breedId: 'bad' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove the image', async () => {
            const existing = { id: 'r1' } as BreedImage;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            jest.spyOn(imageRepo, 'remove').mockResolvedValue(existing as any);

            const result = await service.remove('r1');
            expect(service.findOne).toHaveBeenCalledWith('r1');
            expect(imageRepo.remove).toHaveBeenCalledWith(existing);
            expect(result).toBeUndefined();
        });
    });
});
