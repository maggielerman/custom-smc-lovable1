
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import Cart from './cart/Cart';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-book-red">Little Origins</span>
              <span className="ml-2 text-lg font-medium text-gray-500">Books</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/create" className="font-medium text-gray-600 hover:text-book-red transition duration-150">
              Create Book
            </Link>
            <Link to="/#about" className="font-medium text-gray-600 hover:text-book-red transition duration-150">
              About
            </Link>
            <Link to="/#sample" className="font-medium text-gray-600 hover:text-book-red transition duration-150">
              Sample Pages
            </Link>
            <Link to="/#faq" className="font-medium text-gray-600 hover:text-book-red transition duration-150">
              FAQ
            </Link>
            <Cart className="mr-2" />
            <Button 
              className="bg-book-red hover:bg-red-400 text-white rounded-full" 
              size="sm"
              onClick={() => navigate("/create")}
            >
              Start Creating
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Cart className="mr-2" />
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-2 pt-2 pb-4 space-y-1 bg-white sm:px-3">
          <Link
            to="/create"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-book-red hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Create Book
          </Link>
          <Link
            to="/#about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-book-red hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/#sample"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-book-red hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sample Pages
          </Link>
          <Link
            to="/#faq"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-book-red hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </Link>
          <Button 
            className="w-full mt-3 bg-book-red hover:bg-red-400 text-white rounded-full" 
            size="sm"
            onClick={() => {
              navigate("/create");
              setMobileMenuOpen(false);
            }}
          >
            Start Creating
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
