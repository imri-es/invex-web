import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppLayout } from './components/Layout/AppLayout';
import { AuthLayout } from './components/Layout/AuthLayout';
import { Main } from './pages/Main';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Inventories } from './pages/Inventories';
import { InventoryDetail } from './pages/InventoryDetail';
import { useAppSelector } from './store/hooks';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/login" element={<AuthRoute><AuthLayout><Login /></AuthLayout></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><AuthLayout><Register /></AuthLayout></AuthRoute>} />

            <Route
              path="/*"
              element={
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventories"
                      element={
                        <ProtectedRoute>
                          <Inventories />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/inventories/:id"
                      element={
                        <ProtectedRoute>
                          <InventoryDetail />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </AppLayout>
              }
            />
          </Routes>
        </Router>
    </Provider>
  );
};

export default App;
