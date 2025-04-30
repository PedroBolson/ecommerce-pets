import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DogService } from './dog.service';
import { Dog } from './entities/dog.entity';
import { Breed } from '../breed/entities/breed.entity';
import { CreateDogDto } from './dto/create-dog.dto';
import { NotFoundException } from '@nestjs/common';

describe('DogService', () => {
    let service: DogService;
    let dogRepository: Repository<Dog>;
    let breedRepository: Repository<Breed>;
    let queryBuilder: any;

    beforeEach(async () => {
        // Shared QueryBuilder mock
        queryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
            getOne: jest.fn().mockResolvedValue(null),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DogService,
                {
                    provide: getRepositoryToken(Dog),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
                    },
                },
                {
                    provide: getRepositoryToken(Breed),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<DogService>(DogService);
        dogRepository = module.get<Repository<Dog>>(getRepositoryToken(Dog));
        breedRepository = module.get<Repository<Breed>>(getRepositoryToken(Breed));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new dog', async () => {
            const createDogDto: CreateDogDto = {
                sku: 'DOG-12345',
                ageInMonths: 2,
                gender: 'Male',
                breedId: '1',
                size: 'Medium',
                color: 'brown',
                price: 1200,
                vaccinated: true,
                dewormed: true,
                microchip: false,
                location: 'São Paulo',
                additionalInfo: 'Friendly dog',
            };

            const breed = { id: '1', name: 'Labrador' } as Breed;
            const dog = { id: '1', ...createDogDto, breed } as Dog;

            jest.spyOn(breedRepository, 'findOne').mockResolvedValue(breed);
            jest.spyOn(dogRepository, 'create').mockReturnValue(dog as any);
            jest.spyOn(dogRepository, 'save').mockResolvedValue(dog as any);

            const result = await service.create(createDogDto);

            expect(breedRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(dogRepository.create).toHaveBeenCalled();
            expect(dogRepository.save).toHaveBeenCalled();
            expect(result).toEqual(dog);
        });

        it('should throw an error if breed not found', async () => {
            const createDogDto: CreateDogDto = {
                sku: 'DOG-99999',
                ageInMonths: 24,
                gender: 'Female',
                breedId: '999',
                size: 'Small',
                color: 'brown',
                price: 1500,
                additionalInfo: 'Friendly dog',
            };

            jest.spyOn(breedRepository, 'findOne').mockResolvedValue(null);

            await expect(service.create(createDogDto)).rejects.toThrow(NotFoundException);
            expect(breedRepository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
        });
    });

    describe('findAll', () => {
        it('should return an array of dogs', async () => {
            const dogs = [{ id: '1', name: 'Rex' }, { id: '2', name: 'Max' }];
            jest.spyOn(queryBuilder, 'getMany').mockResolvedValue(dogs as unknown as Dog[]);

            const result = await service.findAll({});

            expect(result).toEqual(dogs);
            expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should find a dog by id', async () => {
            const dog = { id: '1', name: 'Rex' };
            jest.spyOn(queryBuilder, 'getOne').mockResolvedValue(dog as unknown as Dog);

            const result = await service.findOne('1');

            expect(result).toEqual(dog);
            expect(queryBuilder.where).toHaveBeenCalledWith('dog.id = :id', { id: '1' });
        });

        it('should throw an error if dog not found', async () => {
            jest.spyOn(queryBuilder, 'getOne').mockResolvedValue(null);

            await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
        });
    });
});
