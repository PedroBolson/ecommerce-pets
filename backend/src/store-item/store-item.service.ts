import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreItem } from './entities/store-item.entity';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { StoreCategory } from '../store-category/entities/store-category.entity';

@Injectable()
export class StoreItemService {
  constructor(
    @InjectRepository(StoreItem)
    private storeItemRepository: Repository<StoreItem>,
    @InjectRepository(StoreCategory)
    private storeCategoryRepository: Repository<StoreCategory>,
  ) { }

  // Create a new store item
  async create(createStoreItemDto: CreateStoreItemDto): Promise<StoreItem> {
    // Check if category exists
    const category = await this.storeCategoryRepository.findOneBy({ id: createStoreItemDto.categoryId });
    if (!category) {
      throw new NotFoundException(`Category with ID ${createStoreItemDto.categoryId} not found`);
    }

    // Create and save the new item
    const item = this.storeItemRepository.create({
      sku: createStoreItemDto.sku,
      name: createStoreItemDto.name,
      description: createStoreItemDto.description,
      price: createStoreItemDto.price,
      stock: createStoreItemDto.stock || 0,
      category: category,
    });

    return this.storeItemRepository.save(item);
  }

  // Get all items with filtering options
  async findAll(filters?: {
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
  }): Promise<StoreItem[]> {
    const queryBuilder = this.storeItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.images', 'images');

    // Apply filters if provided
    if (filters) {
      if (filters.categoryId) {
        queryBuilder.andWhere('category.id = :categoryId', { categoryId: filters.categoryId });
      }

      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('item.price >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('item.price <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      if (filters.inStock !== undefined) {
        if (filters.inStock) {
          queryBuilder.andWhere('item.stock > 0');
        } else {
          queryBuilder.andWhere('item.stock = 0');
        }
      }
    }

    // Order by category and name
    queryBuilder.orderBy('category.name', 'ASC')
      .addOrderBy('item.name', 'ASC');

    return queryBuilder.getMany();
  }

  // Get a specific item by ID
  async findOne(id: string): Promise<StoreItem> {
    const item = await this.storeItemRepository.findOne({
      where: { id },
      relations: ['category', 'images'],
    });

    if (!item) {
      throw new NotFoundException(`Store item with ID ${id} not found`);
    }

    return item;
  }

  // Update an item
  async update(id: string, updateStoreItemDto: UpdateStoreItemDto): Promise<StoreItem> {
    const item = await this.findOne(id);

    // If categoryId is changing, verify the new category exists
    if (updateStoreItemDto.categoryId && updateStoreItemDto.categoryId !== item.category.id) {
      const newCategory = await this.storeCategoryRepository.findOneBy({ id: updateStoreItemDto.categoryId });
      if (!newCategory) {
        throw new NotFoundException(`Category with ID ${updateStoreItemDto.categoryId} not found`);
      }
      item.category = newCategory;
    }

    // Update other properties
    if (updateStoreItemDto.sku) item.sku = updateStoreItemDto.sku;
    if (updateStoreItemDto.name) item.name = updateStoreItemDto.name;
    if (updateStoreItemDto.description !== undefined) item.description = updateStoreItemDto.description;
    if (updateStoreItemDto.price !== undefined) item.price = updateStoreItemDto.price;
    if (updateStoreItemDto.stock !== undefined) item.stock = updateStoreItemDto.stock;

    return this.storeItemRepository.save(item);
  }

  // Remove an item
  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.storeItemRepository.remove(item);
  }
}
