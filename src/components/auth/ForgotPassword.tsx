
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';

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

// Form schema with validation
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToSignIn: () => void;
}

const ForgotPassword = ({ isOpen, onClose, onBackToSignIn }: ForgotPasswordProps) => {
  // Initialize form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would make an API call to send a password reset email
    console.log('Password reset requested for:', values.email);
    
    toast.success('Password reset instructions sent. Please check your email.');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Your Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you instructions to reset your password.
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
            
            <Button type="submit" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Instructions
            </Button>
            
            <DialogFooter className="pt-4">
              <Button variant="link" type="button" onClick={onBackToSignIn}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
