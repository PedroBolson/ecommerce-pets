import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreCategory } from './entities/store-category.entity';
import { CreateStoreCategoryDto } from './dto/create-store-category.dto';
import { UpdateStoreCategoryDto } from './dto/update-store-category.dto';

@Injectable()
export class StoreCategoryService {
  constructor(
    @InjectRepository(StoreCategory)
    private storeCategoryRepository: Repository<StoreCategory>,
  ) { }

  // Create a new store category
  async create(createStoreCategoryDto: CreateStoreCategoryDto): Promise<StoreCategory> {
    const category = this.storeCategoryRepository.create(createStoreCategoryDto);
    return this.storeCategoryRepository.save(category);
  }

  // Get all categories with their items
  async findAll(): Promise<StoreCategory[]> {
    return this.storeCategoryRepository.find({
      relations: ['items'],
    });
  }

  // Get a specific category by ID with its items
  async findOne(id: string): Promise<StoreCategory> {
    const category = await this.storeCategoryRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!category) {
      throw new NotFoundException(`Store category with ID ${id} not found`);
    }

    return category;
  }

  // Update a category
  async update(id: string, updateStoreCategoryDto: UpdateStoreCategoryDto): Promise<StoreCategory> {
    const category = await this.findOne(id);

    // Update the category properties
    Object.assign(category, updateStoreCategoryDto);

    return this.storeCategoryRepository.save(category);
  }

  // Remove a category
  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.storeCategoryRepository.remove(category);
  }
}
