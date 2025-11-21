'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AutoLogoutProvider } from '@/contexts/AutoLogoutContext';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';
import AutoLogoutModal from '@/components/AutoLogoutModal';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {user ? <Dashboard /> : <AuthPage />}
      <AutoLogoutModal />
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AutoLogoutProvider>
        <AppContent />
      </AutoLogoutProvider>
    </AuthProvider>
  );
}