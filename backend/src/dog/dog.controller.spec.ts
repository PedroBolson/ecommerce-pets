import { Test, TestingModule } from '@nestjs/testing';
import { DogController } from './dog.controller';
import { DogService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

describe('DogController', () => {
    let controller: DogController;
    let service: DogService;

    const mockDog = {
        id: 'dog-id',
        sku: 'DOG001',
        breed: { id: 'breed-id', name: 'Golden Retriever', images: [] },
        gender: 'Male',
        ageInMonths: 6,
        size: 'Medium',
        color: 'Golden',
        price: 1200,
        vaccinated: true,
        dewormed: true,
        certification: 'AKC',
    };

    const mockPaginatedResponse = {
        data: [mockDog],
        pagination: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false
        }
    };

    const mockDogService = {
        create: jest.fn().mockResolvedValue(mockDog),
        findAll: jest.fn().mockResolvedValue(mockPaginatedResponse),
        findOne: jest.fn().mockResolvedValue(mockDog),
        update: jest.fn().mockResolvedValue(mockDog),
        remove: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DogController],
            providers: [
                {
                    provide: DogService,
                    useValue: mockDogService,
                },
            ],
        }).compile();

        controller = module.get<DogController>(DogController);
        service = module.get<DogService>(DogService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a dog', async () => {
            const createDogDto: CreateDogDto = {
                sku: 'DOG001',
                breedId: 'breed-id',
                gender: 'Male',
                ageInMonths: 6,
                size: 'Medium',
                price: 1200,
                color: 'Golden',
                vaccinated: true,
                dewormed: true,
                certification: 'AKC',
            };

            expect(await controller.create(createDogDto)).toEqual(mockDog);
            expect(service.create).toHaveBeenCalledWith(createDogDto);
        });
    });

    describe('findAll', () => {
        it('should return paginated dogs with default pagination', async () => {
            const result = await controller.findAll(undefined, undefined, {});

            expect(result).toEqual(mockPaginatedResponse);
            expect(service.findAll).toHaveBeenCalledWith({
                page: 1,
                limit: 10
            });
        });

        it('should use provided pagination parameters', async () => {
            const result = await controller.findAll(2, 20, {});

            expect(result).toEqual(mockPaginatedResponse);
            expect(service.findAll).toHaveBeenCalledWith({
                page: 2,
                limit: 20
            });
        });

        it('should pass filters along with pagination parameters', async () => {
            const filters = {
                breedId: 'breed-id',
                gender: 'Male',
                minPrice: '100',
                maxPrice: '500'
            };

            await controller.findAll(2, 20, filters);

            expect(service.findAll).toHaveBeenCalledWith({
                page: 2,
                limit: 20,
                breedId: 'breed-id',
                gender: 'Male',
                minPrice: '100',
                maxPrice: '500'
            });
        });
    });

    describe('findOne', () => {
        it('should return a single dog', async () => {
            expect(await controller.findOne('dog-id')).toEqual(mockDog);
            expect(service.findOne).toHaveBeenCalledWith('dog-id');
        });
    });

    describe('update', () => {
        it('should update a dog', async () => {
            const updateDogDto: UpdateDogDto = {
                price: 1500,
            };

            expect(await controller.update('dog-id', updateDogDto)).toEqual(mockDog);
            expect(service.update).toHaveBeenCalledWith('dog-id', updateDogDto);
        });
    });

    describe('remove', () => {
        it('should remove a dog', async () => {
            expect(await controller.remove('dog-id')).toEqual({ affected: 1 });
            expect(service.remove).toHaveBeenCalledWith('dog-id');
        });
    });
});