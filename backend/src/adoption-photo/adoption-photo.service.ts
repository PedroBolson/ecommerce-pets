import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdoptionPhotoDto } from './dto/create-adoption-photo.dto';
import { UpdateAdoptionPhotoDto } from './dto/update-adoption-photo.dto';
import { AdoptionPhoto } from './entities/adoption-photo.entity';
import { Breed } from '../breed/entities/breed.entity';

@Injectable()
export class AdoptionPhotoService {
  constructor(
    @InjectRepository(AdoptionPhoto)
    private adoptionPhotoRepository: Repository<AdoptionPhoto>,
    @InjectRepository(Breed)
    private breedRepository: Repository<Breed>,
  ) { }

  async create(createAdoptionPhotoDto: CreateAdoptionPhotoDto): Promise<AdoptionPhoto> {
    // Check if the breed exists
    const breed = await this.breedRepository.findOneBy({ id: createAdoptionPhotoDto.breedId });
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${createAdoptionPhotoDto.breedId} not found`);
    }

    // Create and save the new photo
    const adoptionPhoto = this.adoptionPhotoRepository.create({
      url: createAdoptionPhotoDto.url,
      altText: createAdoptionPhotoDto.altText,
      displayOrder: createAdoptionPhotoDto.displayOrder || 0,
      breed: breed
    });

    return this.adoptionPhotoRepository.save(adoptionPhoto);
  }

  async findAll(): Promise<AdoptionPhoto[]> {
    return await this.adoptionPhotoRepository.find({
      order: { displayOrder: 'ASC' }
    });
  }

  async findByBreed(breedId: string): Promise<AdoptionPhoto[]> {
    return await this.adoptionPhotoRepository.find({
      where: { breed: { id: breedId } },
      order: { displayOrder: 'ASC' }
    });
  }

  async findOne(id: string): Promise<AdoptionPhoto> {
    const adoptionPhoto = await this.adoptionPhotoRepository.findOne({
      where: { id }
    });

    if (!adoptionPhoto) {
      throw new NotFoundException(`Adoption photo with ID ${id} not found`);
    }

    return adoptionPhoto;
  }

  async update(id: string, updateAdoptionPhotoDto: UpdateAdoptionPhotoDto): Promise<AdoptionPhoto> {
    const adoptionPhoto = await this.findOne(id);

    // If breed ID is changing, check if the new breed exists
    if (updateAdoptionPhotoDto.breedId && updateAdoptionPhotoDto.breedId !== adoptionPhoto.breed.id) {
      const newBreed = await this.breedRepository.findOneBy({ id: updateAdoptionPhotoDto.breedId });
      if (!newBreed) {
        throw new NotFoundException(`Breed with ID ${updateAdoptionPhotoDto.breedId} not found`);
      }
      adoptionPhoto.breed = newBreed;
    }

    // Update other properties
    if (updateAdoptionPhotoDto.url) adoptionPhoto.url = updateAdoptionPhotoDto.url;
    if (updateAdoptionPhotoDto.altText !== undefined) adoptionPhoto.altText = updateAdoptionPhotoDto.altText;
    if (updateAdoptionPhotoDto.displayOrder !== undefined) adoptionPhoto.displayOrder = updateAdoptionPhotoDto.displayOrder;

    return this.adoptionPhotoRepository.save(adoptionPhoto);
  }

  async remove(id: string): Promise<AdoptionPhoto> {
    const adoptionPhoto = await this.findOne(id);
    await this.adoptionPhotoRepository.delete(id);
    return adoptionPhoto;
  }
}
