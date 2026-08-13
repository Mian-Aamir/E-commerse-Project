import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand info and social links */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Brand Name</h2>
          <p className="text-sm text-slate-400 mb-4">
            Short description about the store goes here.
          </p>
          <div className="flex gap-3">
            <FaFacebookF size={16} className="cursor-pointer hover:text-white" />
            <FaInstagram size={16} className="cursor-pointer hover:text-white" />
            <FaTwitter size={16} className="cursor-pointer hover:text-white" />
            <FaYoutube size={16} className="cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:text-white">Home</li>
            <li className="cursor-pointer hover:text-white">Products</li>
            <li className="cursor-pointer hover:text-white">Categories</li>
            <li className="cursor-pointer hover:text-white">New Arrivals</li>
            <li className="cursor-pointer hover:text-white">Sale</li>
          </ul>
        </div>

        {/* Customer service links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:text-white">My Account</li>
            <li className="cursor-pointer hover:text-white">Order Tracking</li>
            <li className="cursor-pointer hover:text-white">Returns and Refunds</li>
            <li className="cursor-pointer hover:text-white">Shipping Info</li>
            <li className="cursor-pointer hover:text-white">FAQ</li>
          </ul>
        </div>

        {/* Contact information */}
        <div id="contact-section">
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>Store address goes here, City, Country</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <span>+92 300 0000000</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <span>support@example.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter subscribe bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            Subscribe to get updates on new arrivals and offers
          </p>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 md:w-64 px-4 py-2 rounded-l-md text-slate-900 outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-r-md text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 text-center text-xs text-slate-500">
          Copyright 2026 Brand Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;