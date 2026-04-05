import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (isLoggedIn && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure user has a role, default to 'intern'
        if (!parsedUser.role) {
          parsedUser.role = 'intern';
          localStorage.setItem('user', JSON.stringify(parsedUser));
          localStorage.setItem('role', 'intern');
        }

        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Fallback: construct user from individual items
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const role = localStorage.getItem('role') || 'intern';

        if (userName && userEmail) {
          const fallbackUser = { name: userName, email: userEmail, role };

          setUser(fallbackUser);
          setIsAuthenticated(true);

          // Save the properly formatted user
          localStorage.setItem('user', JSON.stringify(fallbackUser));
        }
      }
    }

    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const login = (userData) => {
    // Ensure user data has a role, default to 'intern'
    const userWithRole = {
      ...userData,
      role: userData.role || 'intern'
    };

    setUser(userWithRole);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithRole));
    localStorage.setItem('userName', userWithRole.name);
    localStorage.setItem('userEmail', userWithRole.email);
    localStorage.setItem('role', userWithRole.role);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value = {
    user,
    isAuthenticated,
    theme,
    login,
    logout,
    toggleTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
