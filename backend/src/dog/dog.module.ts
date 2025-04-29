import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogService } from './dog.service';
import { DogController } from './dog.controller';
import { Dog } from './entities/dog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dog])],
  controllers: [DogController],
  providers: [DogService],
})
export class DogModule { }
