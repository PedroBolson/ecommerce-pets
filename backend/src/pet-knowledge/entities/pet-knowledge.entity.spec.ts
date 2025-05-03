import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { PetKnowledge } from './pet-knowledge.entity';
import { Breed } from '../../breed/entities/breed.entity';

describe('PetKnowledge Entity – metadata functions', () => {
    it('default arrow for createdAt should return CURRENT_TIMESTAMP', () => {
        const createdAtCol = getMetadataArgsStorage()
            .columns
            .find(c => c.target === PetKnowledge && c.propertyName === 'createdAt')!;
        expect(typeof createdAtCol.options.default).toBe('function');
        expect((createdAtCol.options.default as () => string)()).toBe('CURRENT_TIMESTAMP');
    });

    it('arrow in @ManyToOne should resolve Breed', () => {
        const rel = getMetadataArgsStorage()
            .relations
            .find(r => r.target === PetKnowledge && r.propertyName === 'breed')!;
        expect(typeof rel.type).toBe('function');
        expect((rel.type as () => Function)()).toBe(Breed);
    });
});