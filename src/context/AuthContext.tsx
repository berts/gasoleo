import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { Usuario } from '../types/types';
import { getUsuarioByUsername, updateUsuario } from '../services/storage';

interface AuthContextType {
  user: Usuario | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const usuario = getUsuarioByUsername(username);
    
    if (!usuario || !usuario.activo) {
      return false;
    }

    const isValid = await bcrypt.compare(password, usuario.password);
    
    if (isValid) {
      if (usuario.intentosFallidos > 0) {
        updateUsuario(usuario.id, { intentosFallidos: 0 });
      }
      setUser(usuario);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(usuario));
      return true;
    } else {
      const intentos = (usuario.intentosFallidos || 0) + 1;
      updateUsuario(usuario.id, { 
        intentosFallidos: intentos,
        activo: intentos < 3
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}