import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogService } from './dog.service';
import { DogController } from './dog.controller';
import { Dog } from './entities/dog.entity';
import { Breed } from '../breed/entities/breed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dog, Breed])],
  controllers: [DogController],
  providers: [DogService],
})
export class DogModule { }
