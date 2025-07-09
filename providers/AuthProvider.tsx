// app/AuthInitializer.tsx
"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, user, setUser } = useAuthStore();
  
  useEffect(() => {
    if (token && !user) {
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include' // Important for HttpOnly cookies
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      };
      
      fetchUser();
    }
  }, [token, user, setUser]);

  return <>{children}</>;
}

export default AuthProvider