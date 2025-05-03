import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetKnowledgeService } from './pet-knowledge.service';
import { PetKnowledgeController } from './pet-knowledge.controller';
import { PetKnowledge } from './entities/pet-knowledge.entity';
import { Breed } from '../breed/entities/breed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PetKnowledge, Breed])
  ],
  controllers: [PetKnowledgeController],
  providers: [PetKnowledgeService],
  exports: [PetKnowledgeService],
})
export class PetKnowledgeModule { }
