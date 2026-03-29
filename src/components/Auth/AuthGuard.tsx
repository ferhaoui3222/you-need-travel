import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, User, doc, getDoc, signInWithPopup, googleProvider, signOut } from '../../firebase';
import { Agency } from '../../types';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'agency' | null;
  agencyData: Agency | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'agency' | null>(null);
  const [agencyData, setAgencyData] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check role in Firestore
        const userDoc = await getDoc(doc(db, 'agencies', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as Agency;
          setRole(data.role);
          setAgencyData({ id: userDoc.id, ...data });
        } else if (currentUser.email === 'fabdesettar@gmail.com') {
          setRole('admin');
          setAgencyData({
            id: currentUser.uid,
            name: 'Admin',
            email: currentUser.email,
            commissionRate: 0,
            walletBalance: 0,
            role: 'admin'
          });
        } else {
          setRole(null);
          setAgencyData(null);
        }
      } else {
        setRole(null);
        setAgencyData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, agencyData, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, loading, login } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user || role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <button 
          onClick={login}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login as Admin
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export const AgencyGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, loading, login } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user || (role !== 'agency' && role !== 'admin')) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Agency Access Required</h1>
        <button 
          onClick={login}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login as Agency
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
