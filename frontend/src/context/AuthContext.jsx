import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isDriver, setIsDriver] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if the user is already logged in when the app starts
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        const parsedUser = JSON.parse(loggedInUser);
        setUser(parsedUser);
        setName(parsedUser.name);
        setEmail(parsedUser.email);
        setIsDriver(parsedUser.isDriver || false); // Set if the logged-in entity is a driver
        
      } catch (e) {
        console.error("Failed to parse user JSON:", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Register a new user
  const registerUser = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const { user, token } = await res.json();
        const userData = { name: user.name, email: user.email, token, isDriver: false }; // Set isDriver to false
        setUser(userData);
        setName(user.name);
        setEmail(user.email);
        setIsUser(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
      } else {
        const errorText = await res.text();
        console.error('Registration failed:', errorText);
      }
    } catch (err) {
      console.error('Error during registration:', err);
    }
  };

  // Login existing user
  const loginUser = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { user, token } = await res.json();
        const userData = { name: user.name, email: user.email, token, isDriver: false }; // Set isDriver explicitly to false for users
        setUser(userData);
        setName(user.name);
        setEmail(user.email);
        setIsUser(true);
        setIsDriver(false); // Set to false for regular users
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        const errorText = await res.text();
        console.error('Login failed:', errorText);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  // Register a new driver
  const registerDriver = async (name, email, password, phone, vehicleType) => {
    try {
      const res = await fetch('http://localhost:5000/api/driver/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, vehicleType }),
      });

      if (res.ok) {
        const { user, token } = await res.json();
        const userData = { name: user.name, email: user.email, token, isDriver: true }; // Set isDriver as true
        setUser(userData);
        setName(user.name);
        setEmail(user.email);
        setIsUser(false);
        setIsDriver(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
      } else {
        console.error('Driver registration failed:', await res.text());
      }
    } catch (err) {
      console.error('Error during driver registration:', err);
    }
  };


  const loginDriver = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/driver/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
       
        const { user, token } = await res.json();
        console.log(token)
        const userData = { name: user.name, email: user.email, token, isDriver: true }; // Set isDriver as true
        setUser(userData);
        setName(user.name);
        setEmail(user.email);
        setIsDriver(true);
        setIsUser(false);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
        
      } else {
        console.error('Driver login failed:', await res.text());
      }
    } catch (err) {
      console.error('Error during driver login:', err);
    }
  };
  const loginAdmin = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { user, token } = await res.json();
        const userData = { name: user.name, email: user.email, token, isDriver: false, isAdmin: true };
        setUser(userData);
        setName(user.name);
        setEmail(user.email);
        setIsDriver(false);
        setIsUser(false);
        setIsAdmin(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
      } else {
        console.error('Admin login failed:', await res.text());
      }
    } catch (err) {
      console.error('Error during admin login:', err);
    }
  };


  // Logout user
  const logout = () => {
    setUser(null);
    setIsUser(false);
    setName(null);
    setEmail(null);
    setIsDriver(false);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{user, name, email, isDriver, isAdmin, registerUser, loginUser, logout, registerDriver, loginDriver, loginAdmin,isUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;