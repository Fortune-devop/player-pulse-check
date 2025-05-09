
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Trophy, Gamepad, Shirt, User, LogIn, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserMenu from './auth/UserMenu';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import ForgotPassword from './auth/ForgotPassword';
import Waitlist from './auth/Waitlist';
import EmailVerificationPopup from './auth/EmailVerificationPopup';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const openSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
    setShowForgotPassword(false);
    setMobileMenuOpen(false);
  };

  const openSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
    setShowForgotPassword(false);
    setMobileMenuOpen(false);
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setShowSignIn(false);
    setShowSignUp(false);
  };

  const showVerificationPopup = () => {
    setShowEmailVerification(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo section - optimized for mobile */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="text-xl md:text-2xl font-bold text-primary">
              RateMyPlayer
              <span className="text-warning">.com</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop navigation - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/sport/nba" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
            <Trophy className="h-4 w-4" />
            <span>NBA</span>
          </Link>
          <Link to="/sport/nfl" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
            <Gamepad className="h-4 w-4" />
            <span>NFL</span>
          </Link>
          <Link to="/sport/soccer" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
            <Shirt className="h-4 w-4" />
            <span>Soccer</span>
          </Link>
        </div>
        
        {/* Mobile and desktop right-side controls */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" size="icon" className="md:ml-0">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {isAuthenticated ? (
            <UserMenu showVerificationPopup={showVerificationPopup} />
          ) : (
            <>
              {isMobile ? (
                <>
                  {/* Mobile sign in/up buttons */}
                  <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="md:hidden p-1">
                    <Menu className="h-5 w-5" />
                  </Button>
                  
                  {/* Mobile dropdown menu */}
                  {mobileMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-full bg-white shadow-md rounded-b-lg z-50 md:hidden">
                      <div className="flex flex-col p-4 space-y-3">
                        <Button onClick={openSignIn} variant="outline" className="w-full justify-center">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </Button>
                        <Button onClick={openSignUp} className="w-full justify-center">
                          <User className="mr-2 h-4 w-4" />
                          Sign Up
                        </Button>
                        <div className="pt-2 pb-1 border-t">
                          <Link to="/sport/nba" className="flex items-center space-x-2 py-2 hover:text-primary">
                            <Trophy className="h-4 w-4" />
                            <span>NBA</span>
                          </Link>
                          <Link to="/sport/nfl" className="flex items-center space-x-2 py-2 hover:text-primary">
                            <Gamepad className="h-4 w-4" />
                            <span>NFL</span>
                          </Link>
                          <Link to="/sport/soccer" className="flex items-center space-x-2 py-2 hover:text-primary">
                            <Shirt className="h-4 w-4" />
                            <span>Soccer</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Desktop sign in/up buttons */}
                  <Button variant="outline" onClick={openSignIn}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button onClick={openSignUp}>
                    <User className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Auth popups */}
      <SignIn 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)} 
        onOpenSignUp={openSignUp} 
        onOpenForgotPassword={openForgotPassword}
      />
      
      <SignUp 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)} 
        onOpenSignIn={openSignIn} 
        showVerificationPopup={showVerificationPopup}
      />
      
      <ForgotPassword
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToSignIn={openSignIn}
      />
      
      <EmailVerificationPopup
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
      />
    </header>
  );
};

export default Header;
