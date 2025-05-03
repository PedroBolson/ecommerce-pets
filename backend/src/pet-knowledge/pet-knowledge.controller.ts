import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { PetKnowledgeService } from './pet-knowledge.service';
import { CreatePetKnowledgeDto } from './dto/create-pet-knowledge.dto';
import { UpdatePetKnowledgeDto } from './dto/update-pet-knowledge.dto';
import { PetKnowledge } from './entities/pet-knowledge.entity';

@ApiTags('pet-knowledge')
@Controller('pet-knowledge')
export class PetKnowledgeController {
  constructor(private readonly petKnowledgeService: PetKnowledgeService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new pet knowledge article' })
  @ApiResponse({
    status: 201,
    description: 'The pet knowledge article has been successfully created.',
    type: PetKnowledge,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createPetKnowledgeDto: CreatePetKnowledgeDto) {
    return this.petKnowledgeService.create(createPetKnowledgeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pet knowledge articles' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter articles by category',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starts from 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of pet knowledge articles with pagination.',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(PetKnowledge) }
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 20 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 2 },
            hasNext: { type: 'boolean', example: true },
            hasPrevious: { type: 'boolean', example: false }
          }
        }
      }
    }
  })
  findAll(
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.petKnowledgeService.findAll({
      category,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pet knowledge article by id' })
  @ApiParam({ name: 'id', description: 'The id of the article' })
  @ApiResponse({
    status: 200,
    description: 'The pet knowledge article.',
    type: PetKnowledge,
  })
  @ApiResponse({ status: 404, description: 'Pet knowledge article not found.' })
  findOne(@Param('id') id: string) {
    return this.petKnowledgeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pet knowledge article' })
  @ApiParam({ name: 'id', description: 'The id of the article to update' })
  @ApiResponse({
    status: 200,
    description: 'The pet knowledge article has been successfully updated.',
    type: PetKnowledge,
  })
  @ApiResponse({ status: 404, description: 'Pet knowledge article not found.' })
  update(@Param('id') id: string, @Body() updatePetKnowledgeDto: UpdatePetKnowledgeDto) {
    return this.petKnowledgeService.update(id, updatePetKnowledgeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a pet knowledge article' })
  @ApiParam({ name: 'id', description: 'The id of the article to delete' })
  @ApiResponse({
    status: 200,
    description: 'The pet knowledge article has been successfully deactivated.',
  })
  @ApiResponse({ status: 404, description: 'Pet knowledge article not found.' })
  remove(@Param('id') id: string) {
    return this.petKnowledgeService.remove(id);
  }
}
