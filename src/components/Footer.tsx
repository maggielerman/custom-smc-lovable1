
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-baseline">
              <h2 className="text-2xl font-bold text-book-red">Little Origins</h2>
              <span className="ml-2 text-lg font-medium text-gray-500">Books</span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              Creating beautiful, personalized children's books to help families 
              share their unique donor conception journey with love and confidence.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-book-red transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-book-red transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-book-red transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-book-red transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-book-red transition-colors">About Us</a>
              </li>
              <li>
                <a href="#customize" className="text-gray-600 hover:text-book-red transition-colors">Customize Book</a>
              </li>
              <li>
                <a href="#faq" className="text-gray-600 hover:text-book-red transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-book-red transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-book-red transition-colors">Shipping Information</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-book-red transition-colors">Returns Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-book-red transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-book-red transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center md:text-left text-gray-500 text-sm">
          <p>&copy; {currentYear} Little Origins Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
