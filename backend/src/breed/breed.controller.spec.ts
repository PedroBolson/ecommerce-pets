import { Test, TestingModule } from '@nestjs/testing';
import { BreedController } from './breed.controller';
import { BreedService } from './breed.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';

describe('BreedController', () => {
    let controller: BreedController;
    let service: Record<keyof BreedService, jest.Mock>;

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as Record<keyof BreedService, jest.Mock>;
        controller = new BreedController(service as any);
    });

    it('should create a breed', async () => {
        const dto: CreateBreedDto = { name: 'Labrador' };
        const result = { id: '1', ...dto } as Breed;
        service.create.mockResolvedValue(result);

        expect(await controller.create(dto)).toEqual(result);
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should return all breeds', async () => {
        const breeds = [{ id: '1', name: 'Beagle' }] as Breed[];
        service.findAll.mockResolvedValue(breeds);

        expect(await controller.findAll()).toEqual(breeds);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should return a breed by id', async () => {
        const breed = { id: '2', name: 'Poodle' } as Breed;
        service.findOne.mockResolvedValue(breed);

        expect(await controller.findOne('2')).toEqual(breed);
        expect(service.findOne).toHaveBeenCalledWith('2');
    });

    it('should update a breed', async () => {
        const dto: UpdateBreedDto = { name: 'Golden' };
        const breed = { id: '3', name: 'Golden' } as Breed;
        service.update.mockResolvedValue(breed);

        expect(await controller.update('3', dto)).toEqual(breed);
        expect(service.update).toHaveBeenCalledWith('3', dto);
    });

    it('should remove a breed', async () => {
        service.remove.mockResolvedValue(undefined);

        expect(await controller.remove('4')).toBeUndefined();
        expect(service.remove).toHaveBeenCalledWith('4');
    });
});
