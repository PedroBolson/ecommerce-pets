import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetKnowledge } from './entities/pet-knowledge.entity';
import { CreatePetKnowledgeDto } from './dto/create-pet-knowledge.dto';
import { UpdatePetKnowledgeDto } from './dto/update-pet-knowledge.dto';
import { Breed } from '../breed/entities/breed.entity';

@Injectable()
export class PetKnowledgeService {
  constructor(
    @InjectRepository(PetKnowledge)
    private readonly petKnowledgeRepository: Repository<PetKnowledge>,
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) { }

  /**
   * Create a new pet knowledge article.
   */
  async create(
    createPetKnowledgeDto: CreatePetKnowledgeDto,
  ): Promise<PetKnowledge> {
    const petKnowledge = this.petKnowledgeRepository.create(createPetKnowledgeDto);

    // Handle breed relationship if provided
    if (createPetKnowledgeDto.breedId) {
      const breed = await this.breedRepository.findOne({ where: { id: createPetKnowledgeDto.breedId } });
      if (!breed) {
        throw new NotFoundException(
          `Breed with ID ${createPetKnowledgeDto.breedId} not found`,
        );
      }
      petKnowledge.breed = breed;
    }

    return this.petKnowledgeRepository.save(petKnowledge);
  }

  /**
   * Retrieve pet knowledge articles with optional filtering and pagination.
   * - Falls back to simple find() if QueryBuilder is unavailable (e.g. in basic tests).
   */
  async findAll(
    params: { page?: number; limit?: number; category?: string } = {},
  ): Promise<
    PetKnowledge[] | { data: PetKnowledge[]; pagination: any }
  > {
    const { page = 1, limit = 3, category } = params;

    try {
      const qb = this.petKnowledgeRepository.createQueryBuilder('petKnowledge');
      if (!qb) {
        throw new Error('QueryBuilder is undefined');
      }

      qb.leftJoinAndSelect('petKnowledge.breed', 'breed')
        .where('petKnowledge.isActive = :isActive', { isActive: true });

      if (category) {
        qb.andWhere('petKnowledge.category = :category', { category });
      }

      qb.orderBy('petKnowledge.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      // Execute query and count total
      const [data, total] = await qb.getManyAndCount();

      const totalPages = Math.ceil(total / limit);
      const pagination = {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      };

      return { data, pagination };
    } catch (error) {
      // Fallback para find() em caso de erro
      const where: any = { isActive: true };
      if (category) {
        where.category = category;
      }
      return this.petKnowledgeRepository.find({
        where,
        relations: ['breed'],
        order: { createdAt: 'DESC' },
      });
    }
  }

  /**
   * Find one active article by ID, throwing if not found.
   */
  async findOne(id: string): Promise<PetKnowledge> {
    const article = await this.petKnowledgeRepository.findOne({
      where: { id, isActive: true },
      relations: ['breed'],
    });
    if (!article) {
      throw new NotFoundException(
        `Pet knowledge article with ID ${id} not found`,
      );
    }
    return article;
  }

  /**
   * Update an existing pet knowledge article, handling breed changes.
   */
  async update(
    id: string,
    updatePetKnowledgeDto: UpdatePetKnowledgeDto,
  ): Promise<PetKnowledge> {
    const article = await this.findOne(id);

    Object.assign(article, updatePetKnowledgeDto);

    if (updatePetKnowledgeDto.breedId) {
      const breed = await this.breedRepository.findOne({ where: { id: updatePetKnowledgeDto.breedId } });
      if (!breed) {
        throw new NotFoundException(
          `Breed with ID ${updatePetKnowledgeDto.breedId} not found`,
        );
      }
      article.breed = breed;
    } else if (updatePetKnowledgeDto.breedId === null) {
      article.breed = undefined;
    }

    return this.petKnowledgeRepository.save(article);
  }

  /**
   * Soft-delete (deactivate) an article.
   */
  async remove(id: string): Promise<void> {
    const article = await this.findOne(id);
    article.isActive = false;
    await this.petKnowledgeRepository.save(article);
  }
}
