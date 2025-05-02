<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Pet E-commerce Backend

A NestJS-based RESTful API backend for a pet e-commerce platform, featuring breed management, dog listings, store items, and user authentication.

## 📋 Project Overview

This backend serves as the API for a purebred pet e-commerce platform with the following features:

- **Authentication** - Secure JWT-based authentication
- **User Management** - User registration, profiles, and role-based access
- **Breed Catalog** - Information about different dog breeds with images
- **Dog Listings** - Available dogs for sale with filtering options
- **Store Items** - Pet products and accessories with categories and photos
- **Adoption Photos** - Images for pet adoption

## 🔧 Technologies

- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Swagger API Documentation

## ⚙️ Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecommerce-pets.git
   cd ecommerce-pets/backend
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:  
    Create based on sample below on .env file in the backend folder
    ```bash
    # Server configuration
    PORT=3000
    FRONTEND_URL=http://localhost:5173

    # PostgreSQL connection
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=your-password
    DB_NAME=your-db-name

    # JWT configuration
    JWT_SECRET=your-secure-jwt-secret-key
    ```

## 🏃‍♂️ Running the Application
    
Development mode  
```bash
  npm run start:dev  
```

Production build  
```bash
  npm run build
  npm run start:prod
```
    
The API will be available at: http://localhost:3000

## 📊 API Documentation
Once the application is running, you can access the Swagger API documentation at: http://localhost:3000/api  

## 👤 Creating an Admin User  
To create an admin user for managing the platform:  
```bash
  npm run create-admin
```
This will create an admin user with:  
- Email: admin@monito.com  
- Password: Admin123  

## 🧪 Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📁 Project Structure

```bash
backend/
├── src/
│   ├── app.module.ts          # Main application module
│   ├── main.ts                # Application entry point
│   ├── auth/                  # Authentication module
│   ├── users/                 # User management
│   ├── breed/                 # Breed information
│   ├── breed-image/           # Breed images
│   ├── dog/                   # Dog listings
│   ├── adoption-photo/        # Adoption photos
│   ├── store-category/        # Store categories
│   ├── store-item/            # Store items
│   └── scripts/               # Utility scripts
└── test/                      # E2E tests
```

## 🛠️ Key Endpoints

### Authentication
- `POST /auth/login` - User authentication

### User Management
- `GET /users` - List all users
- `GET /users/:id` - Get user from id
- `POST /users` - Register new user (admin only)
- `PATCH /users/:id` - Update user (admin only)

### Breed Catalog
- `GET /breed` - List all breeds
- `GET /breed/:id` - Get breed details
- `POST /breed` - Create new breed (admin only)
- `PATCH /breed/:id` - Update breed (admin only)
- `DELETE /breed/:id` - Delete breed (admin only)

### Dog Listings
- `GET /dog` - List available dogs (with optional filters)
- `GET /dog/:id` - Get dog details
- `POST /dog` - Create new dog listing (admin only)
- `PATCH /dog/:id` - Update dog listing (admin only)
- `DELETE /dog/:id` - Delete dog listing (admin only)

### Store Items
- `GET /store-category` - List all store categories
- `GET /store-item` - List all store items (with optional filters)
- `GET /store-item/:id` - Get store item details
- `POST /store-item` - Create new store item (admin only)
- `POST /store-category` - Create new category item (admin only)
- `PATCH /store-item/:id` - Update store item (admin only)
- `PATCH /store-category/:id` - Update category item (admin only)
- `DELTE /store-category/:id` - Delete category item (admin only)
- `DELETE /store-item/:id` - Delete store item (admin only)

### Adoption Photos
- `GET /adoption-photo` - List all adoption photos
- `POST /adoption-photo` - Upload new adoption photo (admin only)
- `PATCH /adoption-photo` - Update adoption photo (admin only)
- `DELETE /adoption-photo/:id` - Delete adoption photo (admin only)

### System
- `GET /api/health` - API health check

## 🔐 Security

The API implements comprehensive security measures:

### Authentication
- JWT-based authentication for secure access
- Token refresh mechanism to maintain sessions
- Password hashing using bcrypt

### Authorization
- Role-based access control (RBAC)
- Three primary roles: public, user, and admin
- Public endpoints for browsing content
- Protected endpoints for user-specific actions
- Admin-only endpoints for content management

### API Protection
- Rate limiting to prevent abuse
- CORS configuration for frontend access
- Input validation on all endpoints
- Environmental configuration for sensitive data

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
