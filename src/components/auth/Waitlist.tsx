
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

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
import { addToWaitlist } from '@/context/AuthContext';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
});

interface WaitlistProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
}

// Possible submission states
type SubmissionState = 'idle' | 'success' | 'duplicate' | 'error';

const Waitlist = ({ isOpen, onClose, onOpenSignIn }: WaitlistProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await addToWaitlist(values.name, values.email);
      setSubmissionState('success');
    } catch (error: any) {
      console.error("Waitlist error:", error);
      // Check if the error is for duplicate email
      if (error.message && error.message.includes('already exists')) {
        setSubmissionState('duplicate');
      } else {
        setSubmissionState('error');
        toast.error('Failed to join the waitlist. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset the form and state when closing
    form.reset();
    setSubmissionState('idle');
    onClose();
  };

  const handleSwitchToSignIn = () => {
    handleClose();
    onOpenSignIn();
  };

  // Show different content based on submission state
  const renderContent = () => {
    switch (submissionState) {
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-6">
              You've successfully joined our waitlist! We'll notify you when your account is approved.
            </p>
            <Button onClick={handleClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        );
      
      case 'duplicate':
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Already Subscribed</h3>
            <p className="text-muted-foreground mb-6">
              This email is already on our waitlist. We'll notify you when your account is approved.
            </p>
            <Button onClick={handleClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        );
      
      default:
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
              </Button>
              
              <DialogFooter className="pt-4">
                <Button variant="link" type="button" onClick={handleSwitchToSignIn}>
                  Already have an account? Sign In
                </Button>
              </DialogFooter>
            </form>
          </Form>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {submissionState === 'idle' ? 'Join Our Waitlist' : ''}
          </DialogTitle>
          {submissionState === 'idle' && (
            <DialogDescription>
              Sign up to join our exclusive waitlist. We'll notify you when you're approved to access the platform.
            </DialogDescription>
          )}
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default Waitlist;
