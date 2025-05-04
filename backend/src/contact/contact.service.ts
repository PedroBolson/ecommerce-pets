import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) { }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return this.contactRepository.save(contact);
  }

  async findAll(params: {
    page?: number,
    limit?: number,
    isActive?: boolean,
  } = {}): Promise<{ data: Contact[], pagination: any }> {
    const { page = 1, limit = 10, isActive } = params;

    const queryBuilder = this.contactRepository
      .createQueryBuilder('contact')
      .orderBy('contact.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.andWhere('contact.isActive = :isActive', { isActive });
    }


    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id, isActive: true }
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);

    Object.assign(contact, updateContactDto);

    return this.contactRepository.save(contact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    contact.isActive = false;
    await this.contactRepository.save(contact);
  }

  async getActiveContactsCount(): Promise<number> {
    return this.contactRepository.count({
      where: { isActive: true }
    });
  }
}
