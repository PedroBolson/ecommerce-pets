import { Test, TestingModule } from '@nestjs/testing';
import { PetKnowledgeController } from './pet-knowledge.controller';
import { PetKnowledgeService } from './pet-knowledge.service';
import { CreatePetKnowledgeDto } from './dto/create-pet-knowledge.dto';
import { UpdatePetKnowledgeDto } from './dto/update-pet-knowledge.dto';
import { PetKnowledge } from './entities/pet-knowledge.entity';

describe('PetKnowledgeController', () => {
    let controller: PetKnowledgeController;
    let service: PetKnowledgeService;

    const mockPetKnowledge = {
        id: 'test-id',
        title: 'Test Title',
        summary: 'Test Summary',
        content: 'Test Content',
        imageUrl: 'https://example.com/image.jpg',
        category: 'Test Category',
        createdAt: new Date(),
        isActive: true,
        breed: undefined,
    } as PetKnowledge;

    const mockPetKnowledgeService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PetKnowledgeController],
            providers: [
                {
                    provide: PetKnowledgeService,
                    useValue: mockPetKnowledgeService,
                },
            ],
        }).compile();

        controller = module.get<PetKnowledgeController>(PetKnowledgeController);
        service = module.get<PetKnowledgeService>(PetKnowledgeService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new pet knowledge article', async () => {
            const createDto: CreatePetKnowledgeDto = {
                title: 'Test Title',
                summary: 'Test Summary',
                content: 'Test Content',
                imageUrl: 'https://example.com/image.jpg',
                category: 'Test Category',
            };

            mockPetKnowledgeService.create.mockResolvedValue(mockPetKnowledge);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockPetKnowledge);
        });
    });

    describe('findAll', () => {
        it('should return all pet knowledge articles', async () => {
            mockPetKnowledgeService.findAll.mockResolvedValue([mockPetKnowledge]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockPetKnowledge]);
        });

        it('should filter by category when provided', async () => {
            const category = 'Test Category';
            mockPetKnowledgeService.findAll.mockResolvedValue([mockPetKnowledge]);

            const result = await controller.findAll(category);

            expect(service.findAll).toHaveBeenCalledWith({
                category,
                page: undefined,
                limit: undefined
            });
            expect(result).toEqual([mockPetKnowledge]);
        });

        it('should return paginated pet knowledge articles', async () => {
            const mockResult = {
                data: [mockPetKnowledge],
                pagination: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    hasNext: false,
                    hasPrevious: false
                }
            };

            mockPetKnowledgeService.findAll.mockResolvedValue(mockResult);

            const result = await controller.findAll('Test Category', 1, 10);

            expect(service.findAll).toHaveBeenCalledWith({
                category: 'Test Category',
                page: 1,
                limit: 10
            });
            expect(result).toEqual(mockResult);
        });
    });

    describe('findOne', () => {
        it('should return a single pet knowledge article', async () => {
            const id = 'test-id';
            mockPetKnowledgeService.findOne.mockResolvedValue(mockPetKnowledge);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockPetKnowledge);
        });
    });

    describe('update', () => {
        it('should update a pet knowledge article', async () => {
            const id = 'test-id';
            const updateDto: UpdatePetKnowledgeDto = {
                title: 'Updated Title',
            };

            const updatedArticle = { ...mockPetKnowledge, title: 'Updated Title' };
            mockPetKnowledgeService.update.mockResolvedValue(updatedArticle);

            const result = await controller.update(id, updateDto);

            expect(service.update).toHaveBeenCalledWith(id, updateDto);
            expect(result).toEqual(updatedArticle);
        });
    });

    describe('remove', () => {
        it('should remove a pet knowledge article', async () => {
            const id = 'test-id';
            mockPetKnowledgeService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
});