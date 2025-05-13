import { PartialType } from '@nestjs/swagger';
import { CreatePetKnowledgeDto } from './create-pet-knowledge.dto';

export class UpdatePetKnowledgeDto extends PartialType(CreatePetKnowledgeDto) {
    // The PartialType utility from @nestjs/swagger already:
    // 1. Makes all properties optional
    // 2. Preserves all validation decorators
    // 3. Preserves all @ApiProperty decorators
}
