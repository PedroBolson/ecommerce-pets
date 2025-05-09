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
        // Shared QueryBuilder mock - add getCount for pagination
        queryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
            getOne: jest.fn().mockResolvedValue(null),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockResolvedValue(0), // Add getCount for pagination
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
                        remove: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
                    },
                },
                {
                    provide: getRepositoryToken(Breed),
                    useValue: {
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
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
        // Setup mock data for pagination tests
        const dogs = [
            { id: '1', name: 'Rex' },
            { id: '2', name: 'Max' }
        ];

        beforeEach(() => {
            // Reset mocks for pagination tests
            jest.spyOn(queryBuilder, 'getMany').mockResolvedValue(dogs as unknown as Dog[]);
            jest.spyOn(queryBuilder, 'getCount').mockResolvedValue(10); // Total of 10 dogs
        });

        it('should return paginated dogs with default pagination', async () => {
            const result = await service.findAll({});

            // Check returned structure has data and pagination
            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('pagination');
            expect(result.data).toEqual(dogs);
            expect(result.pagination).toEqual({
                total: 10,
                page: 1,
                limit: 8,  // Changed from 10 to 8
                totalPages: 2,
                hasNext: true,
                hasPrevious: false
            });

            // Check pagination methods were called
            expect(queryBuilder.skip).toHaveBeenCalledWith(0);
            expect(queryBuilder.take).toHaveBeenCalledWith(8);  // Changed from 10 to 8
        });

        it('should use custom pagination parameters', async () => {
            const result = await service.findAll({ page: 2, limit: 5 });

            // Check pagination calculations
            expect(queryBuilder.skip).toHaveBeenCalledWith(5); // (page-1) * limit
            expect(queryBuilder.take).toHaveBeenCalledWith(5);
            expect(result.pagination).toEqual({
                total: 10,
                page: 2,
                limit: 5,
                totalPages: 2,
                hasNext: false,
                hasPrevious: true
            });
        });

        it('should calculate pagination metadata correctly', async () => {
            // Mock a larger dataset (25 items)
            jest.spyOn(queryBuilder, 'getCount').mockResolvedValue(25);

            const result = await service.findAll({ page: 2, limit: 10 });

            expect(result.pagination).toEqual({
                total: 25,
                page: 2,
                limit: 10,
                totalPages: 3,
                hasNext: true,
                hasPrevious: true
            });
        });

        // Existing filter tests 
        it('should apply breedId filter when provided', async () => {
            await service.findAll({ breedId: '123' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('breed.id = :breedId', { breedId: '123' });
        });

        it('should apply gender filter when provided', async () => {
            await service.findAll({ gender: 'Male' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.gender = :gender', { gender: 'Male' });
        });

        it('should apply size filter when provided', async () => {
            await service.findAll({ size: 'Medium' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.size = :size', { size: 'Medium' });
        });

        it('should apply size filter when provided as single value', async () => {
            await service.findAll({ size: 'Medium' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.size = :size', { size: 'Medium' });
        });

        it('should apply size filter when provided as array', async () => {
            await service.findAll({ size: ['Small', 'Medium'] });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.size IN (:...size)', { size: ['Small', 'Medium'] });
        });

        it('should apply color filter when provided as single value', async () => {
            await service.findAll({ color: 'Brown' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.color = :color', { color: 'Brown' });
        });

        it('should apply color filter when provided as array', async () => {
            await service.findAll({ color: ['Black', 'White', 'Brown'] });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.color IN (:...color)', { color: ['Black', 'White', 'Brown'] });
        });

        it('should apply minAge filter when provided', async () => {
            await service.findAll({ minAge: 3 });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.ageInMonths >= :minAge', { minAge: 3 });
        });

        it('should apply maxAge filter when provided', async () => {
            await service.findAll({ maxAge: 12 });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.ageInMonths <= :maxAge', { maxAge: 12 });
        });

        it('should apply minPrice filter when provided', async () => {
            await service.findAll({ minPrice: 500 });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.price >= :minPrice', { minPrice: 500 });
        });

        it('should apply maxPrice filter when provided', async () => {
            await service.findAll({ maxPrice: 2000 });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.price <= :maxPrice', { maxPrice: 2000 });
        });

        it('should apply multiple filters when provided', async () => {
            await service.findAll({
                breedId: '123',
                gender: 'Female',
                minPrice: 500,
                maxPrice: 2000
            });

            expect(queryBuilder.andWhere).toHaveBeenCalledWith('breed.id = :breedId', { breedId: '123' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.gender = :gender', { gender: 'Female' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.price >= :minPrice', { minPrice: 500 });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('dog.price <= :maxPrice', { maxPrice: 2000 });
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

    describe('update', () => {
        it('should update a dog with valid data', async () => {
            const existingDog = {
                id: '1',
                sku: 'DOG-12345',
                breed: { id: '1', name: 'Labrador' },
                gender: 'Male',
                ageInMonths: 6,
                price: 1000
            };

            const updateDto = {
                ageInMonths: 8,
                price: 1200
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(existingDog as any);
            jest.spyOn(dogRepository, 'save').mockResolvedValue({ ...existingDog, ...updateDto } as any);

            const result = await service.update('1', updateDto);

            expect(service.findOne).toHaveBeenCalledWith('1');
            expect(dogRepository.save).toHaveBeenCalled();
            expect(result.ageInMonths).toBe(8);
            expect(result.price).toBe(1200);
        });

        it('should update a dog with new breed', async () => {
            const existingDog = {
                id: '1',
                sku: 'DOG-12345',
                breed: { id: '1', name: 'Labrador' },
                gender: 'Male'
            };

            const newBreed = { id: '2', name: 'Golden Retriever' };

            const updateDto = { breedId: '2' };

            jest.spyOn(service, 'findOne').mockResolvedValue(existingDog as any);
            jest.spyOn(breedRepository, 'findOneBy').mockResolvedValue(newBreed as any);
            jest.spyOn(dogRepository, 'save').mockResolvedValue({ ...existingDog, breed: newBreed } as any);

            const result = await service.update('1', updateDto);

            expect(breedRepository.findOneBy).toHaveBeenCalledWith({ id: '2' });
            expect(dogRepository.save).toHaveBeenCalled();
            expect(result.breed.id).toBe('2');
        });

        it('should throw error when breed not found during update', async () => {
            const existingDog = {
                id: '1',
                breed: { id: '1', name: 'Labrador' }
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(existingDog as any);
            jest.spyOn(breedRepository, 'findOneBy').mockResolvedValue(null);

            await expect(service.update('1', { breedId: '999' }))
                .rejects.toThrow(NotFoundException);

            expect(breedRepository.findOneBy).toHaveBeenCalledWith({ id: '999' });
        });
    });

    describe('remove', () => {
        it('should remove a dog successfully', async () => {
            const dogToDelete = { id: '1', name: 'Rex' };

            jest.spyOn(service, 'findOne').mockResolvedValue(dogToDelete as any);
            jest.spyOn(dogRepository, 'remove').mockResolvedValue(dogToDelete as unknown as Dog);

            await service.remove('1');

            expect(service.findOne).toHaveBeenCalledWith('1');
            expect(dogRepository.remove).toHaveBeenCalledWith(dogToDelete);
        });

        it('should throw error if dog to remove is not found', async () => {
            jest.spyOn(service, 'findOne').mockImplementation(() => {
                throw new NotFoundException('Dog not found');
            });

            await expect(service.remove('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findBySize', () => {
        it('should find dogs by size', async () => {
            const smallDogs = [
                { id: '1', size: 'Small', breed: { id: '1', name: 'Chihuahua' } },
                { id: '2', size: 'Small', breed: { id: '2', name: 'Pomeranian' } }
            ];

            jest.spyOn(dogRepository, 'find').mockResolvedValue(smallDogs as any);

            const result = await service.findBySize('Small');

            expect(dogRepository.find).toHaveBeenCalledWith({
                where: { size: 'Small' },
                relations: ['breed']
            });
            expect(result).toEqual(smallDogs);
            expect(result.length).toBe(2);
        });
    });
});
