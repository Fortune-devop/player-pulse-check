
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail } from 'lucide-react';

interface EmailVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailVerificationPopup = ({ isOpen, onClose }: EmailVerificationPopupProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">Check Your Email</DialogTitle>
          <DialogDescription className="text-center">
            A verification link has been sent to your email address.
            Please check your inbox and click on the link to verify your account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="bg-green-50 text-green-600 p-3 rounded-full">
            <CheckCircle className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            If you don't see the email, please check your spam folder or request a new verification link.
          </p>
          <Button className="w-full" onClick={onClose}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationPopup;
