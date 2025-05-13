import { User } from './user.entity';

describe('User Entity', () => {
    it('should create an instance with provided properties', () => {
        const user = new User();
        user.email = 'test@example.com';
        user.password = 'Password123';
        user.role = 'user';

        expect(user).toBeInstanceOf(User);
        expect(user.email).toBe('test@example.com');
        expect(user.password).toBe('Password123');
        expect(user.role).toBe('user');
    });
});