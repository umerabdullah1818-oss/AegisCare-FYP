import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { 
  Facebook, Twitter, Linkedin, Instagram, 
  Mail, Phone, MapPin, ArrowRight,
  ShieldCheck, Shield, Globe 
} from 'lucide-react';

const Footer = ({ isDarkMode, onLoginClick }) => {
  const navigate = useNavigate(); // Declare navigate function

  // Handle button clicks
  const handleGetStartedClick = () => {
    if (onLoginClick) {
      onLoginClick(); // Use parent function if provided
    } else {
      navigate('/login'); // Navigate directly if standalone
    }
  };

  const handleContactClick = () => {
    navigate('/contact-us');
  };

  // Footer data
  const footerLinks = {
    product: ["Dashboard", "AI Analytics", "Health Monitoring", "Reports", "Mobile App"],
    company: ["About Us", "Careers", "Press", "Blog", "Contact Us"],
    resources: ["Documentation", "API", "Help Center", "Privacy", "Terms"],
    support: ["24/7 Support", "Health Tips", "Caregiver Guide", "FAQ", "Community"]
  };

  const handleLinkClick = (link) => {
    if (link === "Dashboard") {
       const role = localStorage.getItem('userRole');
       if (role === 'doctor') navigate('/doctor-dashboard');
       else if (role === 'elderly') navigate('/elderly-dashboard');
       else if (role === 'caregiver' || role === 'caretaker') navigate('/caregiver-dashboard');
       else if (role === 'admin') navigate('/admin-dashboard');
       else navigate('/login');
    } else if (link === "About Us" || link === "Company") {
       navigate('/about-us');
    } else if (link === "Contact Us" || link === "Contact") {
       navigate('/contact-us');
    } else if (link === "Privacy") {
       navigate('/privacy-policy');
    } else if (link === "Terms") {
       navigate('/terms-of-service');
    } else {
       // Default interaction for other links: smooth scroll to top
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-grid-white/5"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content with consistent container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="md:col-span-2 lg:col-span-2 space-y-6 md:space-y-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/assets/logo.png" 
                  alt="AegisCare Logo" 
                  className="w-16 h-12 sm:w-20 sm:h-14 lg:w-22 lg:h-16"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-white">AegisCare</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Multi AI Agentic Elderly Care Platform</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm sm:text-base max-w-md">
                Empowering families and caregivers with AI-powered health monitoring for elderly loved ones. Trusted by thousands worldwide.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                {socialLinks.map((social, index) => (
                  <button
                    key={index}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:scale-110 transform transition-all duration-300"
                    aria-label={social.label}
                  >
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      {social.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:col-span-3 gap-6 sm:gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category} className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white capitalize">
                    {category}
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {links.map((link, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleLinkClick(link)}
                          className="text-gray-400 hover:text-white flex items-center group transition-all duration-300 text-sm sm:text-base w-full text-left"
                        >
                          <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 sm:my-10 md:my-12 border-t border-gray-800"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-400 text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>+923244519323</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-400 text-sm sm:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>support@aegiscare.com</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-400 text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Lahore,Pakistan</span>
              </div>
            </div>

            {/* Copyright & Additional Links */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="text-gray-500 text-xs sm:text-sm">
                © 2025 AegisCare. All rights reserved.
              </div>
              
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {[
              { label: "HIPAA Compliant", icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { label: "ISO 27001 Certified", icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { label: "GDPR Ready", icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" /> }
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 group hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-purple-900/30 transition-all duration-300"
              >
                <div className="text-blue-400 group-hover:text-white">
                  {badge.icon}
                </div>
                <span className="text-gray-300 group-hover:text-white text-xs sm:text-sm font-medium">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          CTA Banner
          <div className="mt-12 sm:mt-14 md:mt-16 relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
            <div className="relative bg-gradient-to-r from-gray-800/50 via-gray-900/50 to-gray-800/50 backdrop-blur-lg border border-gray-700/50 p-6 sm:p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    Start Your Care Journey Today
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
                    Join thousands of families who trust AegisCare for their elderly loved ones' health monitoring.
                  </p>
                </div>
                {/* CORRECTED: Get Started Free Button */}
                <button 
                  onClick={handleGetStartedClick}
                  className="group px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center space-x-2 sm:space-x-3"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;