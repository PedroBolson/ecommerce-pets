import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

/**
 * Main bootstrap function:
 * - Creates the Nest app
 * - Attempts to create an admin user
 * - Logs success or error
 * - Closes the app
 */
export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const usersService = app.get(UsersService);

    try {
        const adminUser = await usersService.create({
            email: 'admin@monito.com',
            confirmEmail: 'admin@monito.com',
            password: 'Admin123',
            confirmPassword: 'Admin123',
            role: 'admin',
        });
        console.log('Admin user created:', adminUser);
    } catch (error) {
        console.error('Failed to create admin user:', error.message);
    }

    await app.close();
}

/**
 * Determines whether to auto-run bootstrap().
 * By default returns true only when this file is the main module.
 */
export function shouldRunBootstrap() {
    return require.main === module;
}

/**
 * Helper to conditionally run bootstrap().
 * Accepts an override flag for easier testing.
 */
export function runScript(isMain: boolean = shouldRunBootstrap()) {
    if (isMain) {
        bootstrap();
    }
}

// If executed directly, run bootstrap()
runScript();