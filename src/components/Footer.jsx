import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">LOGO</h3>
            <p className="text-gray-400 mb-4">
              Your trusted destination for quality products. We bring you the best selection with exceptional service.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-green-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-green-400 transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-green-400 transition-colors">Cart</Link>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">Shipping Info</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">Returns</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="text-green-400 mt-1" size={20} />
                <span>support@example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-green-400 mt-1" size={20} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-green-400 mt-1" size={20} />
                <span>123 Commerce St, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

