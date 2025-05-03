import 'reflect-metadata';
import { StoreItem } from './store-item.entity';
import { StoreCategory } from '../../store-category/entities/store-category.entity';
import { StoreItemImage } from '../../store-item-image/entities/store-item-image.entity';

describe('StoreItem Entity', () => {
    it('should create an instance of StoreItem', () => {
        const category = new StoreCategory();
        category.id = 'cat-1';
        category.name = 'Dog Toys';

        const storeItem = new StoreItem();
        storeItem.id = 'item-1';
        storeItem.sku = 'TOY-001';
        storeItem.name = 'Premium Dog Ball';
        storeItem.description = 'Durable rubber ball for dogs';
        storeItem.price = 14.99;
        storeItem.stock = 50;
        storeItem.category = category;
        storeItem.images = [];

        expect(storeItem).toBeDefined();
        expect(storeItem.id).toBe('item-1');
        expect(storeItem.sku).toBe('TOY-001');
        expect(storeItem.name).toBe('Premium Dog Ball');
        expect(storeItem.description).toBe('Durable rubber ball for dogs');
        expect(storeItem.price).toBe(14.99);
        expect(storeItem.stock).toBe(50);
        expect(storeItem.category).toBe(category);
        expect(Array.isArray(storeItem.images)).toBe(true);

        const images = storeItem.images;
        storeItem.images = [];
        storeItem.images = images;
    });

    it('should handle relationships properly', () => {
        const category = new StoreCategory();
        category.id = 'cat-1';
        category.name = 'Dog Toys';

        const storeItem = new StoreItem();
        storeItem.id = 'item-1';
        storeItem.name = 'Premium Dog Ball';
        storeItem.category = category;
        storeItem.images = [];

        const image1 = new StoreItemImage();
        image1.id = 'img-1';
        image1.url = 'url1';
        image1.item = storeItem;

        const image2 = new StoreItemImage();
        image2.id = 'img-2';
        image2.url = 'url2';
        image2.item = storeItem;

        storeItem.images.push(image1);
        storeItem.images.push(image2);

        expect(storeItem.images.length).toBe(2);
        expect(storeItem.images[0].id).toBe('img-1');
        expect(storeItem.images[1].id).toBe('img-2');
    });

    it('should set default values correctly', () => {
        const storeItem = new StoreItem();

        expect(storeItem.id).toBeUndefined();
        expect(storeItem.stock).toBeUndefined();
        expect(storeItem.images).toBeUndefined();
        storeItem.images = [];
        expect(Array.isArray(storeItem.images)).toBe(true);
        expect(storeItem.images.length).toBe(0);
    });

    it('should have all required properties', () => {
        const instance = new StoreItem();
        expect(instance).toHaveProperty('id');
        expect(instance).toHaveProperty('sku');
        expect(instance).toHaveProperty('name');
        expect(instance).toHaveProperty('description');
        expect(instance).toHaveProperty('price');
        expect(instance).toHaveProperty('stock');
        expect(instance).toHaveProperty('category');
        expect(instance).toHaveProperty('images');

        Object.defineProperty(instance, 'images', {
            value: [],
            writable: true,
            configurable: true
        });

        expect(instance.images).toEqual([]);
    });
});
