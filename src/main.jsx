import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext';
import { RolesProvider } from './context/RolesContext';
import { ModulesProvider } from './context/ModulesContext';
import { FeaturesProvider } from './context/FeatureContext';
import { UsersProvider } from './context/UsersContext';
import App from './App.jsx'
import './index.css'
import "react-quill/dist/quill.snow.css";
import "./styles/global.css";
import { BrandProvider } from './context/BrandContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { ServiceProvider } from './context/ServiceContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AddressProvider } from './context/AddressContext';
import { OrderProvider } from './context/OrderContext';
import { GlobalProvider } from './context/GlobalContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          {/* 1. Global Config/Structures first */}

          <GlobalProvider>
            <ModulesProvider>
              <FeaturesProvider>
                {/* 2. Identity and Access next */}
                <RolesProvider>
                  <UsersProvider>
                    <AddressProvider>
                      <BrandProvider>
                        <CategoryProvider>
                          <ProductProvider>
                            <ServiceProvider>
                              <CartProvider>
                                <WishlistProvider>
                                  <OrderProvider>
                                    <App />
                                  </OrderProvider>
                                </WishlistProvider>
                              </CartProvider>
                            </ServiceProvider>
                          </ProductProvider>
                        </CategoryProvider>
                      </BrandProvider>
                    </AddressProvider>
                  </UsersProvider>
                </RolesProvider>
              </FeaturesProvider>
            </ModulesProvider>
          </GlobalProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
