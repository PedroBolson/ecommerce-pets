import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdoptionPhotoService } from './adoption-photo.service';
import { AdoptionPhoto } from './entities/adoption-photo.entity';
import { Breed } from '../breed/entities/breed.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateAdoptionPhotoDto } from './dto/create-adoption-photo.dto';
import { UpdateAdoptionPhotoDto } from './dto/update-adoption-photo.dto';

describe('AdoptionPhotoService', () => {
    let service: AdoptionPhotoService;
    let photoRepo: Repository<AdoptionPhoto>;
    let breedRepo: Repository<Breed>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdoptionPhotoService,
                {
                    provide: getRepositoryToken(AdoptionPhoto),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        delete: jest.fn(),
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

        service = module.get<AdoptionPhotoService>(AdoptionPhotoService);
        photoRepo = module.get<Repository<AdoptionPhoto>>(getRepositoryToken(AdoptionPhoto));
        breedRepo = module.get<Repository<Breed>>(getRepositoryToken(Breed));
    });

    describe('create', () => {
        it('should create a new adoption photo when breed exists', async () => {
            const dto: CreateAdoptionPhotoDto = {
                url: 'http://image.jpg',
                altText: 'Alt text',
                displayOrder: 2,
                breedId: 'breed-1',
            };
            const breed = { id: 'breed-1' } as Breed;
            const photo = { id: 'photo-1', url: dto.url, altText: dto.altText, displayOrder: dto.displayOrder, breed } as AdoptionPhoto;

            jest.spyOn(breedRepo, 'findOneBy').mockResolvedValue(breed);
            jest.spyOn(photoRepo, 'create').mockReturnValue(photo as any);
            jest.spyOn(photoRepo, 'save').mockResolvedValue(photo as any);

            const result = await service.create(dto);

            expect(breedRepo.findOneBy).toHaveBeenCalledWith({ id: dto.breedId });
            expect(photoRepo.create).toHaveBeenCalledWith({
                url: dto.url,
                altText: dto.altText,
                displayOrder: dto.displayOrder,
                breed,
            });
            expect(photoRepo.save).toHaveBeenCalledWith(photo);
            expect(result).toEqual(photo);
        });

        it('should throw NotFoundException if breed not found', async () => {
            const dto: CreateAdoptionPhotoDto = {
                url: 'http://image.jpg',
                altText: 'Alt text',
                displayOrder: 1,
                breedId: 'invalid',
            };

            jest.spyOn(breedRepo, 'findOneBy').mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
            expect(breedRepo.findOneBy).toHaveBeenCalledWith({ id: dto.breedId });
        });
    });

    describe('findAll', () => {
        it('should return all photos ordered by displayOrder', async () => {
            const photos = [{ id: '1' } as AdoptionPhoto, { id: '2' } as AdoptionPhoto];
            jest.spyOn(photoRepo, 'find').mockResolvedValue(photos);

            const result = await service.findAll();
            expect(photoRepo.find).toHaveBeenCalledWith({ order: { displayOrder: 'ASC' } });
            expect(result).toEqual(photos);
        });
    });

    describe('findByBreed', () => {
        it('should return photos for a given breed', async () => {
            const photos = [{ id: '3' } as AdoptionPhoto];
            jest.spyOn(photoRepo, 'find').mockResolvedValue(photos);

            const result = await service.findByBreed('breed-3');
            expect(photoRepo.find).toHaveBeenCalledWith({
                where: { breed: { id: 'breed-3' } },
                order: { displayOrder: 'ASC' },
            });
            expect(result).toEqual(photos);
        });
    });

    describe('findOne', () => {
        it('should return a photo when found', async () => {
            const photo = { id: 'p1' } as AdoptionPhoto;
            jest.spyOn(photoRepo, 'findOne').mockResolvedValue(photo);

            const result = await service.findOne('p1');
            expect(photoRepo.findOne).toHaveBeenCalledWith({ where: { id: 'p1' } });
            expect(result).toEqual(photo);
        });

        it('should throw NotFoundException when photo not found', async () => {
            jest.spyOn(photoRepo, 'findOne').mockResolvedValue(null);
            await expect(service.findOne('xxx')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update properties and save', async () => {
            const existing = { id: 'u1', url: 'old', altText: 'old', displayOrder: 0, breed: { id: 'b1' } } as AdoptionPhoto;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);

            const dto: UpdateAdoptionPhotoDto = { url: 'new', altText: 'new', displayOrder: 5 };
            jest.spyOn(photoRepo, 'save').mockResolvedValue({ ...existing, ...dto } as AdoptionPhoto);

            const result = await service.update('u1', dto);
            expect(service.findOne).toHaveBeenCalledWith('u1');
            expect(photoRepo.save).toHaveBeenCalledWith({ ...existing, ...dto });
            expect(result.url).toBe('new');
        });

        it('should change breed when breedId provided', async () => {
            const existing = { id: 'u2', url: 'u2', altText: '', displayOrder: 0, breed: { id: 'b1' } } as AdoptionPhoto;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);

            const newBreed = { id: 'b2' } as Breed;
            const dto: UpdateAdoptionPhotoDto = { breedId: 'b2' };
            jest.spyOn(breedRepo, 'findOneBy').mockResolvedValue(newBreed);
            jest.spyOn(photoRepo, 'save').mockResolvedValue({ ...existing, breed: newBreed } as AdoptionPhoto);

            const result = await service.update('u2', dto);
            expect(breedRepo.findOneBy).toHaveBeenCalledWith({ id: 'b2' });
            expect(photoRepo.save).toHaveBeenCalledWith({ ...existing, breed: newBreed });
            expect(result.breed).toEqual(newBreed);
        });

        it('should throw NotFoundException if new breed not found', async () => {
            const existing = { id: 'u3', url: '', altText: '', displayOrder: 0, breed: { id: 'b1' } } as AdoptionPhoto;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);

            jest.spyOn(breedRepo, 'findOneBy').mockResolvedValue(null);
            await expect(service.update('u3', { breedId: 'bad' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should delete and return the photo', async () => {
            const existing = { id: 'r1' } as AdoptionPhoto;
            jest.spyOn(service, 'findOne').mockResolvedValue(existing);
            jest.spyOn(photoRepo, 'delete').mockResolvedValue({} as any);

            const result = await service.remove('r1');
            expect(service.findOne).toHaveBeenCalledWith('r1');
            expect(photoRepo.delete).toHaveBeenCalledWith('r1');
            expect(result).toEqual(existing);
        });
    });
});
