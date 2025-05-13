import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breed } from './entities/breed.entity';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';

@Injectable()
export class BreedService {
  constructor(
    @InjectRepository(Breed)
    private breedRepository: Repository<Breed>,
  ) { }

  // Create a new dog breed
  async create(createBreedDto: CreateBreedDto): Promise<Breed> {
    const breed = this.breedRepository.create(createBreedDto);
    return this.breedRepository.save(breed);
  }

  // Get all breeds with their images
  async findAll(): Promise<Breed[]> {
    return this.breedRepository.find({
      relations: ['images'],
    });
  }

  // Get a specific breed by ID with its images
  async findOne(id: string): Promise<Breed> {
    const breed = await this.breedRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!breed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }

    return breed;
  }

  // Update a breed's information
  async update(id: string, updateBreedDto: UpdateBreedDto): Promise<Breed> {
    const breed = await this.findOne(id);

    // Update the breed properties
    Object.assign(breed, updateBreedDto);

    return this.breedRepository.save(breed);
  }

  // Remove a breed
  async remove(id: string): Promise<void> {
    const breed = await this.findOne(id);
    await this.breedRepository.remove(breed);
  }
}
