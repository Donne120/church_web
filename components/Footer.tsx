import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D2B66] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">CYSMF</h3>
            <p className="text-sm text-gray-300">
              Christian Youth and Students Missionary Fellowship - Empowering young believers on campuses across Rwanda.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://www.facebook.com/share/173yFhh5SG/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFB703] transition-colors" 
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/cysmf_life" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFB703] transition-colors" 
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/@CMCIRwanda" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFB703] transition-colors" 
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/campus" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  Campus Map
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  Media Hub
                </Link>
              </li>
              <li>
                <Link href="/get-involved" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  Get Involved
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/safeguarding" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  Safeguarding Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-300 hover:text-[#FFB703] transition-colors">
                  Leader Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>info@cysmf.org</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+250 XXX XXX XXX</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Kigali, Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Christian Youth and Students Missionary Fellowship (CYSMF). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

