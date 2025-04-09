
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Trophy, Gamepad, Shirt } from 'lucide-react';

const Header = () => {
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
          <Button variant="outline">Sign In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
