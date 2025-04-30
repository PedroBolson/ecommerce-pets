import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreItemImage } from './entities/store-item-image.entity';
import { CreateStoreItemImageDto } from './dto/create-store-item-image.dto';
import { UpdateStoreItemImageDto } from './dto/update-store-item-image.dto';
import { StoreItem } from '../store-item/entities/store-item.entity';

@Injectable()
export class StoreItemImageService {
  constructor(
    @InjectRepository(StoreItemImage)
    private storeItemImageRepository: Repository<StoreItemImage>,
    @InjectRepository(StoreItem)
    private storeItemRepository: Repository<StoreItem>,
  ) { }

  // Add a new image for an item
  async create(createStoreItemImageDto: CreateStoreItemImageDto): Promise<StoreItemImage> {
    // Check if item exists
    const item = await this.storeItemRepository.findOneBy({ id: createStoreItemImageDto.itemId });
    if (!item) {
      throw new NotFoundException(`Store item with ID ${createStoreItemImageDto.itemId} not found`);
    }

    // Create and save the new image
    const image = this.storeItemImageRepository.create({
      url: createStoreItemImageDto.url,
      altText: createStoreItemImageDto.altText,
      displayOrder: createStoreItemImageDto.displayOrder || 0,
      item: item
    });

    return this.storeItemImageRepository.save(image);
  }

  // Get all item images
  async findAll(): Promise<StoreItemImage[]> {
    return this.storeItemImageRepository.find({
      relations: ['item'],
    });
  }

  // Get all images for a specific item
  async findByItem(itemId: string): Promise<StoreItemImage[]> {
    return this.storeItemImageRepository.find({
      where: { item: { id: itemId } },
      order: { displayOrder: 'ASC' },
    });
  }

  // Get a specific image by ID
  async findOne(id: string): Promise<StoreItemImage> {
    const image = await this.storeItemImageRepository.findOne({
      where: { id },
      relations: ['item'],
    });

    if (!image) {
      throw new NotFoundException(`Store item image with ID ${id} not found`);
    }

    return image;
  }

  // Update an image
  async update(id: string, updateStoreItemImageDto: UpdateStoreItemImageDto): Promise<StoreItemImage> {
    const image = await this.findOne(id);

    // If item ID is changing, verify the new item exists
    if (updateStoreItemImageDto.itemId && updateStoreItemImageDto.itemId !== image.item.id) {
      const newItem = await this.storeItemRepository.findOneBy({ id: updateStoreItemImageDto.itemId });
      if (!newItem) {
        throw new NotFoundException(`Store item with ID ${updateStoreItemImageDto.itemId} not found`);
      }
      image.item = newItem;
    }

    // Update other properties
    if (updateStoreItemImageDto.url) image.url = updateStoreItemImageDto.url;
    if (updateStoreItemImageDto.altText !== undefined) image.altText = updateStoreItemImageDto.altText;
    if (updateStoreItemImageDto.displayOrder !== undefined) image.displayOrder = updateStoreItemImageDto.displayOrder;

    return this.storeItemImageRepository.save(image);
  }

  // Remove an image
  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);
    await this.storeItemImageRepository.remove(image);
  }
}
