import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Sparkles, ShieldCheck, PhoneCall, Mail, MapPin, ChevronRight, Heart, Star, Gem, Award as AwardIcon } from 'lucide-react';

const BeautifulFooter = ({ isDarkMode, setActiveModule }) => {
    return (
      <footer className={`mt-12 rounded-3xl overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-rose-950/40' 
          : 'bg-gradient-to-br from-rose-50 via-white to-blue-50'
      } border-t-2 ${isDarkMode ? 'border-gray-800' : 'border-rose-100'}`}>
        
        {/* Decorative Top Elements */}
        <div className="relative">
          {/* Floating animated elements */}
          <div className="absolute -top-6 left-10 w-12 h-12 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 animate-bounce opacity-20"></div>
          <div className="absolute -top-4 right-20 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-pulse opacity-30"></div>
          <div className="absolute -top-8 left-1/3 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 animate-bounce opacity-25" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Main Footer Content */}
          <div className="relative z-10">
            {/* Footer Top Section */}
            <div className="py-8 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  
                  {/* Brand Column */}
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-2xl ${
                        isDarkMode ? 'bg-gradient-to-r from-rose-950/40 to-pink-950/30' : 'bg-gradient-to-r from-rose-100 to-pink-100'
                      }`}>
                        <img 
                          src="/assets/logo.png" 
                          alt="AegisCare Logo" 
                          className="w-20 h-12 sm:w-20 sm:h-14 lg:w-22 lg:h-16"
                        />
                      </div>
                      <div>
                        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Aegis<span className="text-rose-500">Care</span>
                        </h2>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          Multi AI Agentic Elderly Care Platform
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-4`}>
Empowering families and caregivers with AI-powered health monitoring for elderly loved ones. Trusted by thousands worldwide.                    </p>
                    <div className="flex gap-3">
                      {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                        <a key={index} href="#" className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                          isDarkMode 
                            ? 'bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                            : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 shadow-sm'
                        }`}>
                          <Icon size={16} />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      <Sparkles size={16} className="text-amber-500" />
                      Quick Links
                    </h3>
                    <ul className="space-y-2">
                      {[
                        { label: 'Health Dashboard', module: 'dashboard' },
                        { label: 'Vitals Monitoring', module: 'health-monitoring' },
                        { label: 'Medication Tracker', module: 'medication' },
                        { label: 'Emergency Services', module: 'emergency' },
                        { label: 'Telemedicine', module: 'dashboard' }
                      ].map((item, index) => (
                        <li key={index}>
                          <button onClick={() => { setActiveModule(item.module); window.scrollTo({ top: 0, behavior: 'smooth'}); }} className={`text-sm transition-all duration-300 hover:translate-x-1 flex items-center gap-2 ${
                            isDarkMode ? 'text-gray-500 hover:text-rose-400' : 'text-gray-600 hover:text-rose-600'
                          }`}>
                            <ChevronRight size={12} className={isDarkMode ? 'text-rose-500' : 'text-rose-400'} />
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      <ShieldCheck size={16} className="text-emerald-500" />
                      Our Services
                    </h3>
                    <ul className="space-y-2">
                      {[
                        { label: '24/7 Health Monitoring', module: 'health-monitoring' },
                        { label: 'AI-Powered Insights', module: 'analytics' },
                        { label: 'VR Cognitive Therapy', module: 'dashboard' },
                        { label: 'Diet & Nutrition Plans', module: 'diet-routine' },
                        { label: 'Family Portal Access', module: 'caregiver-connect' }
                      ].map((item, index) => (
                        <li key={index}>
                          <button onClick={() => { setActiveModule(item.module); window.scrollTo({ top: 0, behavior: 'smooth'}); }} className={`text-sm transition-all duration-300 hover:translate-x-1 flex items-center gap-2 ${
                            isDarkMode ? 'text-gray-500 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
                          }`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      <PhoneCall size={16} className="text-blue-500" />
                      Contact Us
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-950/30' : 'bg-blue-100'}`}>
                          <PhoneCall size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Emergency Hotline</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>24/7 03244519323</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-rose-950/30' : 'bg-rose-100'}`}>
                          <Mail size={14} className={isDarkMode ? 'text-rose-400' : 'text-rose-600'} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Email Support</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>support@aegiscare.com</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-950/30' : 'bg-amber-100'}`}>
                          <MapPin size={14} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Headquarters</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Lahore, Pakistan</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className={`py-6 px-4 rounded-2xl mb-6 ${
                  isDarkMode ? 'bg-gray-900/40' : 'bg-white/50'
                } border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-emerald-950/30' : 'bg-emerald-100'}`}>
                        <ShieldCheck size={14} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                      </div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        HIPAA Compliant
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-blue-950/30' : 'bg-blue-100'}`}>
                        <Star size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      </div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        99.9% Uptime
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-purple-950/30' : 'bg-purple-100'}`}>
                        <AwardIcon size={14} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                      </div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        Award Winning
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-rose-950/30' : 'bg-rose-100'}`}>
                        <Heart size={14} className={isDarkMode ? 'text-rose-400' : 'text-rose-600'} />
                      </div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        10K+ Happy Seniors
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t pt-6 border-gray-800/50">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        © 2025 AegisCare. All rights reserved. 
                        <span className="mx-2">•</span>
                        <a href="#" className={`hover:underline ${isDarkMode ? 'text-rose-400 hover:text-rose-300' : 'text-rose-600 hover:text-rose-700'}`}>
                          Privacy Policy
                        </a>
                        <span className="mx-2">•</span>
                        <a href="#" className={`hover:underline ${isDarkMode ? 'text-rose-400 hover:text-rose-300' : 'text-rose-600 hover:text-rose-700'}`}>
                          Terms of Service
                        </a>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Gem size={12} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                        <span className={`text-xs ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                          Senior-Friendly Design
                        </span>
                      </div>
                      <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className={`text-xs ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          System Status: Operational
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating decorative elements at bottom */}
                  <div className="absolute bottom-4 right-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-10 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={20} className="text-cyan-400/50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

export default BeautifulFooter;
