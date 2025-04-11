
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Google } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

// Form schema with validation
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
  onOpenForgotPassword: () => void;
}

const SignIn = ({ isOpen, onClose, onOpenSignUp, onOpenForgotPassword }: SignInProps) => {
  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would make an API call to authenticate
    console.log('Sign in attempt:', values);
    
    // For demo purposes, simulate a successful login
    const userData = {
      id: '123456',
      email: values.email, 
      name: values.email.split('@')[0],
      avatar: null,
    };

    login(userData);
    toast.success('Signed in successfully!');
    onClose();
    navigate('/profile');
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      toast.success('Signed in with Google successfully!');
      onClose();
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  const handleSwitchToSignUp = () => {
    onClose();
    onOpenSignUp();
  };

  const handleForgotPassword = () => {
    onClose();
    onOpenForgotPassword();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Enter your email and password to access your account.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Sign In with Email
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full"
            >
              <Google className="mr-2 h-4 w-4" />
              Sign In with Google
            </Button>
            
            <DialogFooter className="pt-4">
              <Button variant="link" type="button" onClick={handleSwitchToSignUp}>
                Need an account? Sign Up
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignIn;
