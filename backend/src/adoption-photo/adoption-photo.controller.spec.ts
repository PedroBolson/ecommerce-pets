import { AdoptionPhotoController } from './adoption-photo.controller';
import { AdoptionPhotoService } from './adoption-photo.service';
import { CreateAdoptionPhotoDto } from './dto/create-adoption-photo.dto';
import { UpdateAdoptionPhotoDto } from './dto/update-adoption-photo.dto';
import { AdoptionPhoto } from './entities/adoption-photo.entity';

describe('AdoptionPhotoController', () => {
    let controller: AdoptionPhotoController;
    let service: Record<keyof AdoptionPhotoService, jest.Mock>;

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findByBreed: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as Record<keyof AdoptionPhotoService, jest.Mock>;
        controller = new AdoptionPhotoController(service as unknown as AdoptionPhotoService);
    });

    it('should create a new adoption photo', async () => {
        const dto: CreateAdoptionPhotoDto = { url: 'u', altText: 'a', displayOrder: 1, breedId: 'b1' };
        const result = { id: 'p1', ...dto, breed: { id: dto.breedId } } as unknown as AdoptionPhoto;
        service.create.mockResolvedValue(result);

        expect(await controller.create(dto)).toEqual(result);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should return all adoption photos', async () => {
        const photos = [{ id: 'p1' }] as AdoptionPhoto[];
        service.findAll.mockResolvedValue(photos);

        expect(await controller.findAll()).toEqual(photos);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should return photos by breed', async () => {
        const photos = [{ id: 'p2' }] as AdoptionPhoto[];
        service.findByBreed.mockResolvedValue(photos);

        expect(await controller.findByBreed('breed1')).toEqual(photos);
        expect(service.findByBreed).toHaveBeenCalledWith('breed1');
    });

    it('should return a single adoption photo', async () => {
        const photo = { id: 'p3' } as AdoptionPhoto;
        service.findOne.mockResolvedValue(photo);

        expect(await controller.findOne('p3')).toEqual(photo);
        expect(service.findOne).toHaveBeenCalledWith('p3');
    });

    it('should update an adoption photo', async () => {
        const dto: UpdateAdoptionPhotoDto = { url: 'u2' };
        const photo = { id: 'p4', url: 'u2' } as AdoptionPhoto;
        service.update.mockResolvedValue(photo);

        expect(await controller.update('p4', dto)).toEqual(photo);
        expect(service.update).toHaveBeenCalledWith('p4', dto);
    });

    it('should remove an adoption photo', async () => {
        service.remove.mockResolvedValue(undefined);

        expect(await controller.remove('p5')).toEqual(undefined);
        expect(service.remove).toHaveBeenCalledWith('p5');
    });
});
