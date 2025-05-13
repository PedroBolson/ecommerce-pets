import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BreedService } from './breed.service';
import { Breed } from './entities/breed.entity';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';

describe('BreedService', () => {
    let service: BreedService;
    let repository: Repository<Breed>;

    const mockBreed = {
        id: 'breed-id',
        name: 'Golden Retriever',
        description: 'Friendly family dog',
        images: [],
    };

    const mockRepository = () => ({
        create: jest.fn().mockReturnValue(mockBreed),
        save: jest.fn().mockResolvedValue(mockBreed),
        find: jest.fn().mockResolvedValue([mockBreed]),
        findOne: jest.fn().mockResolvedValue(mockBreed),
        remove: jest.fn().mockResolvedValue(true),
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BreedService,
                {
                    provide: getRepositoryToken(Breed),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<BreedService>(BreedService);
        repository = module.get<Repository<Breed>>(getRepositoryToken(Breed));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new breed', async () => {
            const createBreedDto: CreateBreedDto = {
                name: 'Labrador Retriever',
                description: 'Friendly and outgoing dogs',
            };

            const result = await service.create(createBreedDto);

            expect(repository.create).toHaveBeenCalledWith(createBreedDto);
            expect(repository.save).toHaveBeenCalled();
            expect(result).toEqual(mockBreed);
        });
    });

    describe('findAll', () => {
        it('should return an array of breeds with their images', async () => {
            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalledWith({
                relations: ['images'],
            });
            expect(result).toEqual([mockBreed]);
        });
    });

    describe('findOne', () => {
        it('should return a specific breed by ID with its images', async () => {
            const result = await service.findOne('breed-id');

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: 'breed-id' },
                relations: ['images'],
            });
            expect(result).toEqual(mockBreed);
        });

        it('should throw NotFoundException when breed is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

            await expect(service.findOne('non-existent-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('should update a breed', async () => {
            const updateBreedDto: UpdateBreedDto = {
                description: 'Updated description',
            };

            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockBreed);

            const result = await service.update('breed-id', updateBreedDto);

            expect(service.findOne).toHaveBeenCalledWith('breed-id');
            expect(repository.save).toHaveBeenCalledWith({
                ...mockBreed,
                ...updateBreedDto,
            });
            expect(result).toEqual(mockBreed);
        });
    });

    describe('remove', () => {
        it('should remove a breed', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockBreed);

            await service.remove('breed-id');

            expect(service.findOne).toHaveBeenCalledWith('breed-id');
            expect(repository.remove).toHaveBeenCalledWith(mockBreed);
        });
    });
});