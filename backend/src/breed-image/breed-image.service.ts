import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BreedImage } from './entities/breed-image.entity';
import { CreateBreedImageDto } from './dto/create-breed-image.dto';
import { UpdateBreedImageDto } from './dto/update-breed-image.dto';
import { Breed } from '../breed/entities/breed.entity';

@Injectable()
export class BreedImageService {
  constructor(
    @InjectRepository(BreedImage)
    private breedImageRepository: Repository<BreedImage>,
    @InjectRepository(Breed)
    private breedRepository: Repository<Breed>,
  ) { }

  // Add a new image for a breed
  async create(createBreedImageDto: CreateBreedImageDto): Promise<BreedImage> {
    // Check if breed exists
    const breed = await this.breedRepository.findOneBy({ id: createBreedImageDto.breedId });
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${createBreedImageDto.breedId} not found`);
    }

    // Create and save the new image
    const breedImage = this.breedImageRepository.create({
      url: createBreedImageDto.url,
      altText: createBreedImageDto.altText,
      displayOrder: createBreedImageDto.displayOrder || 0,
      breed: breed
    });

    return this.breedImageRepository.save(breedImage);
  }

  // Get all breed images
  async findAll(): Promise<BreedImage[]> {
    return this.breedImageRepository.find({
      relations: ['breed'],
    });
  }

  // Get all images for a specific breed
  async findByBreed(breedId: string): Promise<BreedImage[]> {
    return this.breedImageRepository.find({
      where: { breed: { id: breedId } },
      order: { displayOrder: 'ASC' },
    });
  }

  // Get a specific image by ID
  async findOne(id: string): Promise<BreedImage> {
    const image = await this.breedImageRepository.findOne({
      where: { id },
      relations: ['breed'],
    });

    if (!image) {
      throw new NotFoundException(`Breed image with ID ${id} not found`);
    }

    return image;
  }

  // Update an image
  async update(id: string, updateBreedImageDto: UpdateBreedImageDto): Promise<BreedImage> {
    const image = await this.findOne(id);

    // If breed ID is changing, verify the new breed exists
    if (updateBreedImageDto.breedId && updateBreedImageDto.breedId !== image.breed.id) {
      const newBreed = await this.breedRepository.findOneBy({ id: updateBreedImageDto.breedId });
      if (!newBreed) {
        throw new NotFoundException(`Breed with ID ${updateBreedImageDto.breedId} not found`);
      }
      image.breed = newBreed;
    }

    // Update other properties
    if (updateBreedImageDto.url) image.url = updateBreedImageDto.url;
    if (updateBreedImageDto.altText !== undefined) image.altText = updateBreedImageDto.altText;
    if (updateBreedImageDto.displayOrder !== undefined) image.displayOrder = updateBreedImageDto.displayOrder;

    return this.breedImageRepository.save(image);
  }

  // Remove an image
  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);
    await this.breedImageRepository.remove(image);
  }
}
