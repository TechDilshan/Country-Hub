
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';
import { User, Save, Trash2, AlertTriangle } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    // Prepare update data
    const updateData = {
      name,
      email
    };
    
    // Only include password if it was changed
    if (password) {
      updateData.password = password;
    }
    
    try {
      const success = await updateProfile(updateData);
      if (success) {
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const success = await deleteAccount();
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-explorer-navy mb-8">My Profile</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-explorer-blue" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your personal information
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
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password (leave blank to keep current)
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-explorer-blue hover:bg-explorer-navy"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="text-red-600">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Danger Zone</CardTitle>
            </div>
            <CardDescription className="text-red-500">
              Permanently delete your account and all of your data
            </CardDescription>
          </CardHeader>
          
          <CardFooter>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardFooter>
        </Card>
        
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all of your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600"
              >
                Yes, delete my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
