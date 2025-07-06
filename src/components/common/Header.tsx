import Image from "next/image";
import Link from "next/link";

const Header = () => (
  <header className="bg-[#4c2882]/90 backdrop-blur-sm shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo and Text */}
        <div className="flex items-center space-x-4">
          <Image
            src="/lost2Cause_logo.png"
            alt="Lost2Cause Logo"
            width={280}
            height={80}
            className="h-16 w-auto"
            priority
          />
          <span className="text-2xl font-bold text-white">Lost2Cause</span>
        </div>
        {/* Right side - Navigation and Auth */}
        <div className="flex items-center space-x-8">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-8">
            <Link href="/services" className="text-white/90 hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-white/90 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-white/90 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header; 