import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import MainPage from './pages/Store/MainPage/MainPage';
// import DogsPage from './pages/Store/DogsPage';
import DogDetailsPage from './pages/Store/DogDetailsPage/DogDetailsPage';
import { CurrencyProvider } from './context/CurrencyContext';
// import ProductsPage from './pages/Store/ProductsPage';
// import ProductDetailsPage from './pages/Store/ProductDetailsPage';
// import ArticlesPage from './pages/Store/ArticlesPage';
// import ArticleDetailsPage from './pages/Store/ArticleDetailsPage';

const App: React.FC = () => {
  const isAuthenticated = (): boolean => {
    return localStorage.getItem('token') !== null;
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <CurrencyProvider>
      <BrowserRouter>
        <Routes>
          {/* Public store routes */}
          <Route path="/" element={<MainPage />} />
          {/* <Route path="/dogs" element={<DogsPage />} /> */}
          <Route path="/dogs/:id" element={<DogDetailsPage />} />
          {/* <Route path="/products" element={<ProductsPage />} /> */}
          {/* <Route path="/products/:id" element={<ProductDetailsPage />} /> */}
          {/* <Route path="/articles" element={<ArticlesPage />} /> */}
          {/* <Route path="/articles/:id" element={<ArticleDetailsPage />} /> */}

          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </CurrencyProvider>
  );
};

export default App;