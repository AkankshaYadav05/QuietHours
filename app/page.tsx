'use client';

import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-2xl">🔕</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginForm />;
}