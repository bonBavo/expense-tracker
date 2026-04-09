import React, { useState } from 'react';
import { db } from '../db';
import { User, Lock, UserPlus, LogIn, Mail } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginInput, setLoginInput] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (isRegistering) {
      if (!username || username.length < 3) {
        setError('Username must be at least 3 characters long');
        return false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else {
      if (!loginInput) {
        setError('Please enter your username or email');
        return false;
      }
    }
    
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long');
      return false;
    }
    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      if (isRegistering) {
        // Registration
        const existingUser = await db.users.where('username').equals(username).first();
        if (existingUser) {
          setError('Username already exists');
          return;
        }
        
        const existingEmail = await db.users.where('email').equals(email).first();
        if (existingEmail) {
          setError('Email already exists');
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.users.add({ username, email, password: hashedPassword });
        setSuccess('Registration successful! You can now log in.');
        setIsRegistering(false);
        // Clear fields
        setLoginInput(username);
        setPassword('');
        setConfirmPassword('');
      } else {
        // Login
        // Try username first, then email
        let user = await db.users.where('username').equals(loginInput).first();
        if (!user) {
          user = await db.users.where('email').equals(loginInput).first();
        }

        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            onLogin(user);
          } else {
            setError('Invalid username/email or password');
          }
        } else {
          setError('Invalid username/email or password');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card auth-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={isRegistering ? 'register' : 'login'}
            initial={{ opacity: 0, x: isRegistering ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRegistering ? -20 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="subtitle">
              {isRegistering 
                ? 'Join Bon Expense Tracker to manage your finances' 
                : 'Log in to access your dashboard'}
            </p>
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div 
            className="success-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="auth-form">
          {isRegistering ? (
            <>
              <div className="input-group">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Username or Email"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
              />
            </div>
          )}

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegistering && (
            <div className="input-group">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="primary"
          >
            {isRegistering ? (
              <><UserPlus size={18} style={{ marginRight: '8px' }} /> Register</>
            ) : (
              <><LogIn size={18} style={{ marginRight: '8px' }} /> Login</>
            )}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              className="text-link" 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }}
            >
              {isRegistering ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;
