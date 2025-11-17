import LoginScreen from './screens/auth/LoginScreen';
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterScreen from './screens/auth/RegisterScreen';
import PrivacyPolicyScreen from './screens/terms/PrivacyPolicyScreen';
import { useNavigate } from 'react-router-dom';
import TermsAndConditionsScreen from './screens/terms/TermsAndConditionsScreen';
import { AuthProvider } from './utils/AuthContext';
import NotFoundScreen from './screens/core/NotFoundScreen';
import SafeRoute from './utils/SafeRoute';
import LoadingScreen from './screens/core/LoadingScreen';
import { Suspense } from 'react';
import VoroAppScreen from './screens/app/VoroAppScreen';

function App() {
  const navigate = useNavigate();

  return (
     <AuthProvider>
        <Suspense fallback={<LoadingScreen />} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginScreen />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyScreen onBack={() => navigate(-1)} />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsScreen onBack={() => navigate(-1)} />} />

          <Route
            path="/app"
            element={
              <SafeRoute>
                <VoroAppScreen />
              </SafeRoute>
            }
           />

           <Route path="*" element={<NotFoundScreen onBack={() => navigate(-1)} />} />
        </Routes>
     </AuthProvider>
  );
}

export default App;