import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, getSchemaPath, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@ApiTags('contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({
    status: 201,
    description: 'Contact successfully created',
    type: Contact,
  })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get contacts with pagination' })
  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starting from 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'List of contacts with pagination',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(Contact) }
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrevious: { type: 'boolean' }
          }
        }
      }
    }
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isActive') isActiveRaw?: string,
  ) {
    const isActive = isActiveRaw === 'true' ? true
      : isActiveRaw === 'false' ? false
        : undefined;

    return this.contactService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      isActive,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Contact found',
    type: Contact,
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
  })
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiResponse({
    status: 200,
    description: 'Contact successfully updated',
    type: Contact,
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
  })
  @ApiBearerAuth('access-token')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a contact' })
  @ApiResponse({
    status: 200,
    description: 'Contact successfully deactivated',
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
  })
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }

  @Get('count/active')
  @ApiOperation({ summary: 'Get count of active contacts' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Number of active contacts',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  })
  getActiveCount() {
    return this.contactService.getActiveContactsCount()
      .then(count => ({ count }));
  }
}
