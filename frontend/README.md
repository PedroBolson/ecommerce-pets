# Monito Frontend

## Overview
The Monito Frontend is a React-based web application designed for an e-commerce platform specializing in pet adoption and related products. It provides a user-friendly interface for browsing pets, managing user accounts, and exploring various pet-related resources.

## Features
- **Home Page**: Displays featured pets, products, and articles.
- **Pet Browsing**: View detailed information about available pets for adoption.
- **Product Browsing**: Explore pet-related products with detailed descriptions.
- **User Dashboard**: Manage breeds, dogs, adoption photos, and more (admin-only features).
- **Search Functionality**: Search for pets, products, and articles.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack
- **React**: Frontend library for building user interfaces.
- **React Router**: For client-side routing.
- **TypeScript**: For type safety and better developer experience.
- **Vite**: For fast development and build processes.
- **Axios**: For making HTTP requests.
- **MUI**: For UI components.
- **React Image Gallery**: For displaying image carousels.
- **Swiper**: For interactive sliders.

## Project Structure
```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/       # Reusable components
│   ├── context/          # Context API for state management
│   ├── pages/            # Page components
│   ├── services/         # API service files
│   ├── storecomponents/  # Components specific to store features
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/PedroBolson/ecommerce-pets.git
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Development
To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Build
To build the project for production:
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

## Linting
To run the linter:
```bash
npm run lint
```

## Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run lint`: Run ESLint to check for code quality issues.
- `npm run preview`: Preview the production build.

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```
VITE_API_BASE_URL=<API_BASE_URL>
```
Replace `<API_BASE_URL>` with the backend API URL.

## Dependencies
### Main Dependencies
- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `react-router-dom`: ^7.5.3
- `axios`: ^1.9.0
- `@mui/material`: ^7.0.2
- `swiper`: ^11.2.6

### Dev Dependencies
- `vite`: ^6.3.1
- `typescript`: ~5.7.2
- `eslint`: ^9.22.0
- `@vitejs/plugin-react`: ^4.3.4

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For any inquiries or issues, please contact the project maintainers.