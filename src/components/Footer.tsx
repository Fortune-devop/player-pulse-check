
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-12">
      <div className="container grid grid-cols-1 gap-8 px-4 md:px-6 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-medium">RateMyPlayer.com</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Fan-driven ratings for professional athletes.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Sports</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/sport/nfl" className="text-sm text-muted-foreground hover:text-primary">
                NFL
              </Link>
            </li>
            <li>
              <Link to="/sport/nba" className="text-sm text-muted-foreground hover:text-primary">
                NBA
              </Link>
            </li>
            <li>
              <Link to="/sport/soccer" className="text-sm text-muted-foreground hover:text-primary">
                Soccer
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium">Resources</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium">Legal</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 border-t pt-4 px-4 md:px-6">
        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} RateMyPlayer.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
