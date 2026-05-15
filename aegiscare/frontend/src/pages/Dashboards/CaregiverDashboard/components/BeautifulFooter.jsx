import React from 'react';
import { 
  Heart, Sparkles, ChevronRight, ShieldCheck, PhoneCall, Mail, 
  Award as AwardIcon, Database 
} from 'lucide-react';

const BeautifulFooter = ({ isDarkMode, setActiveModule }) => {
  return (
    <footer className={`mt-12 rounded-3xl overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/40' 
        : 'bg-gradient-to-br from-emerald-50 via-white to-blue-50'
    } border-t-2 ${isDarkMode ? 'border-gray-800' : 'border-emerald-100'}`}>
      
      <div className="relative">
        {/* Floating animated elements */}
        <div className="absolute -top-6 left-10 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 animate-bounce opacity-20"></div>
        <div className="absolute -top-4 right-20 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-pulse opacity-30"></div>
        
        {/* Main Footer Content */}
        <div className="relative z-10">
          <div className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                
                {/* Brand Column */}
                <div className="md:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl ${
                      isDarkMode ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/30' : 'bg-gradient-to-r from-emerald-100 to-teal-100'
                    }`}>
                      <Heart className={`w-8 h-8 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Aegis<span className="text-emerald-500">Care</span> 
                      </h2>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Caregiver Support Dashboard
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mb-4`}>
                    Empowering families and caregivers with AI-powered health monitoring for elderly loved ones. Trusted by thousands worldwide.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    <Sparkles size={16} className="text-amber-500" />
                    Caregiver Tools
                  </h3>
                  <ul className="space-y-2">
                    {[
                      { label: 'Elderly Monitoring', module: 'elderly-list' },
                      { label: 'Medication Tracker', module: 'medication' },
                      { label: 'Diet Plan Review', module: 'diet-plan-review' },
                      { label: 'Emergency Alerts', module: 'alerts' },
                      { label: 'Health Analytics', module: 'analytics' }
                    ].map((item, index) => (
                      <li key={index}>
                        <button onClick={() => { setActiveModule(item.module); window.scrollTo({ top: 0, behavior: 'smooth'}); }} className={`text-sm transition-all duration-300 hover:translate-x-1 flex items-center gap-2 ${
                          isDarkMode ? 'text-gray-500 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
                        }`}>
                          <ChevronRight size={12} className={isDarkMode ? 'text-emerald-500' : 'text-emerald-400'} />
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services */}
                <div>
                  <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    <ShieldCheck size={16} className="text-blue-500" />
                    Features
                  </h3>
                  <ul className="space-y-2">
                    {[
                      { label: 'Real-time Monitoring', module: 'elderly-list' },
                      { label: 'Medication Reminders', module: 'medication' },
                      { label: 'Diet Plan Approval', module: 'diet-plan-review' },
                      { label: 'GPS Location', module: 'emergency' },
                      { label: 'Health Alerts', module: 'alerts' }
                    ].map((item, index) => (
                      <li key={index}>
                        <button onClick={() => { setActiveModule(item.module); window.scrollTo({ top: 0, behavior: 'smooth'}); }} className={`text-sm transition-all duration-300 hover:translate-x-1 flex items-center gap-2 ${
                          isDarkMode ? 'text-gray-500 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    <PhoneCall size={16} className="text-rose-500" />
                    Support
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-rose-950/30' : 'bg-rose-100'}`}>
                        <PhoneCall size={14} className={isDarkMode ? 'text-rose-400' : 'text-rose-600'} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>24/7 Caregiver Support</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>24/7 03244519323</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-950/30' : 'bg-blue-100'}`}>
                        <Mail size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Email Support</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>caregiver@aegiscare.com</p>
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
                      <AwardIcon size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      Certified Caregivers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-purple-950/30' : 'bg-purple-100'}`}>
                      <Database size={14} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      Secure Data Storage
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t pt-6 border-gray-800/50">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      © 2025 AegisCare Family. All rights reserved. 
                      <span className="mx-2">•</span>
                      <a href="#" className={`hover:underline ${isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>
                        Privacy Policy
                      </a>
                      <span className="mx-2">•</span>
                      <a href="#" className={`hover:underline ${isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>
                        Terms of Service
                      </a>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className={`text-xs ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        System Status: Operational
                      </span>
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
