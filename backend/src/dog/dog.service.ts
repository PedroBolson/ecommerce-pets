import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from './entities/dog.entity';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { Breed } from '../breed/entities/breed.entity';

@Injectable()
export class DogService {
  constructor(
    @InjectRepository(Dog)
    private dogRepository: Repository<Dog>,
    @InjectRepository(Breed)
    private breedRepository: Repository<Breed>,
  ) { }

  // Create a new dog listing
  async create(createDogDto: CreateDogDto): Promise<Dog> {
    // Check if breed exists
    const breed = await this.breedRepository.findOne({ where: { id: createDogDto.breedId } });
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${createDogDto.breedId} not found`);
    }

    // Create dog with valid size classification
    const dog = this.dogRepository.create({
      sku: createDogDto.sku,
      breed: breed,
      gender: createDogDto.gender,
      ageInMonths: createDogDto.ageInMonths,
      size: createDogDto.size, // Must be one of: 'Small', 'Medium', 'Large'
      color: createDogDto.color,
      price: createDogDto.price,
      vaccinated: createDogDto.vaccinated || false,
      dewormed: createDogDto.dewormed || false,
      certification: createDogDto.certification,
      microchip: createDogDto.microchip || false,
      location: createDogDto.location,
      publishedDate: createDogDto.publishedDate || new Date().toISOString().split('T')[0],
      additionalInfo: createDogDto.additionalInfo
    });

    return this.dogRepository.save(dog);
  }

  // Get all dogs with filtering options
  async findAll(filters?: {
    breedId?: string,
    gender?: 'Male' | 'Female',
    size?: string,
    color?: string,
    minAge?: number,
    maxAge?: number,
    minPrice?: number,
    maxPrice?: number,
  }): Promise<Dog[]> {
    const queryBuilder = this.dogRepository
      .createQueryBuilder('dog')
      .leftJoinAndSelect('dog.breed', 'breed');

    // Apply filters if provided
    if (filters) {
      if (filters.breedId) {
        queryBuilder.andWhere('breed.id = :breedId', { breedId: filters.breedId });
      }

      if (filters.gender) {
        queryBuilder.andWhere('dog.gender = :gender', { gender: filters.gender });
      }

      if (filters.size) {
        queryBuilder.andWhere('dog.size = :size', { size: filters.size });
      }

      if (filters.minAge !== undefined) {
        queryBuilder.andWhere('dog.ageInMonths >= :minAge', { minAge: filters.minAge });
      }

      if (filters.maxAge !== undefined) {
        queryBuilder.andWhere('dog.ageInMonths <= :maxAge', { maxAge: filters.maxAge });
      }

      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('dog.price >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('dog.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }
    }

    return queryBuilder.getMany();
  }

  // Get a specific dog by ID
  async findOne(id: string): Promise<Dog> {
    const qb = this.dogRepository
      .createQueryBuilder('dog')
      .leftJoinAndSelect('dog.breed', 'breed')
      .where('dog.id = :id', { id });

    const dog = await qb.getOne();
    if (!dog) {
      throw new NotFoundException(`Dog with ID ${id} not found`);
    }
    return dog;
  }

  // Update a dog listing
  async update(id: string, updateDogDto: UpdateDogDto): Promise<Dog> {
    const dog = await this.findOne(id);

    // If breedId is changing, verify the new breed exists
    if (updateDogDto.breedId && updateDogDto.breedId !== dog.breed.id) {
      const newBreed = await this.breedRepository.findOneBy({ id: updateDogDto.breedId });
      if (!newBreed) {
        throw new NotFoundException(`Breed with ID ${updateDogDto.breedId} not found`);
      }
      dog.breed = newBreed;
    }

    // Update dog properties, excluding breed which was handled above
    Object.keys(updateDogDto).forEach(key => {
      if (key !== 'breedId' && updateDogDto[key] !== undefined) {
        dog[key] = updateDogDto[key];
      }
    });

    return this.dogRepository.save(dog);
  }

  // Remove a dog listing
  async remove(id: string): Promise<void> {
    const dog = await this.findOne(id);
    await this.dogRepository.remove(dog);
  }

  // Find dogs by size category (useful filtering method)
  async findBySize(size: string): Promise<Dog[]> {
    return this.dogRepository.find({
      where: { size },
      relations: ['breed'],
    });
  }
}
