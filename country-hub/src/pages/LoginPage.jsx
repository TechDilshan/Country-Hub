import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Globe } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        throw new Error('Please fill in all fields');
      }
      
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-explorer-blue rounded-full p-3">
                <LogIn className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Log In</CardTitle>
            <CardDescription>
              Enter your email and password to log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-explorer-blue hover:bg-explorer-navy"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-explorer-blue hover:underline">
                Register
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              <p className="mb-2">Demo Accounts:</p>
              <code className="bg-gray-100 p-1 rounded">demo@example.com / password</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage; 