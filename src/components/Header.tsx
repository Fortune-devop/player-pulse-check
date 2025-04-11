
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Trophy, Gamepad, Shirt, User, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserMenu from './auth/UserMenu';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import ForgotPassword from './auth/ForgotPassword';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const openSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
    setShowForgotPassword(false);
  };

  const openSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
    setShowForgotPassword(false);
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setShowSignIn(false);
    setShowSignUp(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">
              RateMyPlayer
              <span className="text-warning">.com</span>
            </div>
          </Link>
        </div>
        
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
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
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
        </div>
      </div>

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
      />
      
      <ForgotPassword
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToSignIn={openSignIn}
      />
    </header>
  );
};

export default Header;
