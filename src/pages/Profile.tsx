import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, CheckCircle, XCircle, Mail } from 'lucide-react';
import EmailVerificationPopup from '@/components/auth/EmailVerificationPopup';

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
  avatarUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout, updateUserProfile, sendVerificationEmail } = useAuth();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  
  // Initialize form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.name || '',
      email: user?.email || '',
      avatarUrl: user?.avatar || '',
    },
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar || '',
      });
    }
  }, [user, form]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateUserProfile({
      name: values.name,
      avatar: values.avatarUrl || null,
    });
  };

  // Handle verification email
  const handleSendVerificationEmail = async () => {
    await sendVerificationEmail();
    setShowEmailVerification(true);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // We'll redirect in the useEffect
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="mt-2">
                    {user.emailVerified ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!user.emailVerified && (
              <Alert className="mb-6">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Please verify your email address to access all features.
                  <Button 
                    variant="link" 
                    onClick={handleSendVerificationEmail}
                    className="p-0 h-auto ml-2"
                  >
                    Resend verification email
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/avatar.jpg" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4">
                  <Button variant="destructive" type="button" onClick={handleLogout}>
                    Log Out
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <EmailVerificationPopup 
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
      />
    </div>
  );
};

export default Profile;
