import React, { useState } from 'react';
import {
  HelpCircle, Mail, Phone, MessageCircle, ArrowLeft,
  ChevronDown, ChevronUp, Search, ExternalLink,
  BookOpen, Shield, Heart, Stethoscope, UserCircle,
  Clock, Send, FileText, AlertCircle, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roleThemes = {
  elderly: {
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
    lightGradient: 'from-rose-50 via-pink-50 to-fuchsia-50',
    accent: 'text-rose-600',
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-200',
    buttonBg: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
    icon: <Heart className="w-5 h-5" />,
    label: 'Elderly',
    dashboardPath: '/elderly-dashboard',
    faqs: [
      { q: 'How do I update my health records?', a: 'Navigate to the Health Records section from your dashboard. Click on "Add Record" to enter new health data, or click on an existing record to update it.' },
      { q: 'How can I set medication reminders?', a: 'Go to the Medications section and click "Add Reminder". You can set the time, frequency, and medication name. You\'ll receive notifications at the scheduled times.' },
      { q: 'How do I contact my assigned caregiver?', a: 'Your assigned caregiver\'s information is available on your dashboard. Click on their profile card to see their contact details or send them a message.' },
      { q: 'Can I share my health data with my doctor?', a: 'Yes! Go to Settings > Privacy > Data Sharing. You can choose which health metrics to share and with which healthcare providers.' },
      { q: 'How do I use the emergency SOS feature?', a: 'The SOS button is always visible on your dashboard. Press and hold for 3 seconds to send an emergency alert to your caregiver and emergency contacts.' },
    ],
  },
  doctor: {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    lightGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    accent: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    icon: <Stethoscope className="w-5 h-5" />,
    label: 'Doctor',
    dashboardPath: '/doctor-dashboard',
    faqs: [
      { q: 'How do I view my assigned patients?', a: 'Your patient list is accessible from the dashboard sidebar under "My Patients". You can filter by name, condition, or appointment date.' },
      { q: 'How do I manage appointments?', a: 'Go to the Appointments section to view, accept, or reschedule appointments. You can also set your availability schedule from Settings.' },
      { q: 'How do I access patient health records?', a: 'Click on any patient from your list to view their complete health profile, including vitals, medications, and medical history.' },
      { q: 'Can I send prescriptions digitally?', a: 'Yes, navigate to a patient\'s profile and click "Add Prescription". Fill in the medication details and it will be sent to the patient\'s pharmacy.' },
      { q: 'How do I update my professional credentials?', a: 'Go to your Profile page and click "Edit Profile". You can update your specialization, license number, and other professional details.' },
    ],
  },
  caregiver: {
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    lightGradient: 'from-amber-50 via-orange-50 to-yellow-50',
    accent: 'text-amber-600',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    icon: <UserCircle className="w-5 h-5" />,
    label: 'Caregiver',
    dashboardPath: '/caregiver-dashboard',
    faqs: [
      { q: 'How do I view the elderly person I care for?', a: 'Your assigned elderly person\'s profile is available on your dashboard. Click their card to view their health data, medications, and daily activities.' },
      { q: 'How do I log daily care activities?', a: 'Go to the Activities section and click "Log Activity". You can record meals, medications given, exercises, and other care activities.' },
      { q: 'How do I communicate with the doctor?', a: 'Use the Messages section to send messages to the assigned doctor. You can also view the doctor\'s notes and recommendations.' },
      { q: 'How do I handle emergency situations?', a: 'In an emergency, use the SOS feature from the dashboard. It will alert the assigned doctor and emergency services. You can also call emergency contacts directly.' },
      { q: 'Can I update the care schedule?', a: 'Yes, go to Schedule section to view and modify the care schedule. Changes will be notified to the elderly person and their family members.' },
    ],
  },
  admin: {
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    lightGradient: 'from-purple-50 via-violet-50 to-indigo-50',
    accent: 'text-purple-600',
    accentBg: 'bg-purple-50',
    accentBorder: 'border-purple-200',
    buttonBg: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-indigo-700',
    icon: <Shield className="w-5 h-5" />,
    label: 'Administrator',
    dashboardPath: '/admin-dashboard',
    faqs: [
      { q: 'How do I add a new user to the system?', a: 'Navigate to "Manage Users" from your dashboard. Click the "Add User" button, fill in their required details, and select their role.' },
      { q: 'How do I assign doctors to elderly patients?', a: 'Go to the "Assignments" section. Select an elderly patient from the list, click "Assign Doctor", and choose an available doctor from the catalog.' },
      { q: 'What do I do if there is a security alert?', a: 'Click the "Security" tab to review recent alerts. High-severity alerts require immediate attention to ensure system integrity.' },
      { q: 'How can I view system logs?', a: 'Select the "System Logs" module on your dashboard. You can search, sort by severity, and filter logs by date or user for troubleshooting.' },
      { q: 'How to update system settings?', a: 'Open "System Settings" from the navigation menu. Here you can configure general preferences, notifications, and security thresholds.' },
    ],
  },
};

const HelpSupportPage = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'elderly';
  const theme = roleThemes[userRole] || roleThemes.elderly;

  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filteredFaqs = theme.faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)' }}>
      {/* Header */}
      <div className={`relative bg-gradient-to-r ${theme.gradient} overflow-hidden`}>
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-20">
          <button
            onClick={() => navigate(theme.dashboardPath)}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Help & Support</h1>
              <p className="text-white/80 text-sm mt-1">We're here to help you, {theme.label}!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 space-y-8">

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Mail className="w-6 h-6" />,
              title: 'Email Us',
              subtitle: 'support@aegiscare.com',
              desc: 'Usually responds within 24 hours',
              color: 'from-blue-500 to-indigo-600',
            },
            {
              icon: <Phone className="w-6 h-6" />,
              title: 'Call Us',
              subtitle: '+1 (800) 123-4567',
              desc: 'Mon-Fri, 9AM - 6PM',
              color: 'from-emerald-500 to-teal-600',
            },
            {
              icon: <MessageCircle className="w-6 h-6" />,
              title: 'Live Chat',
              subtitle: 'Chat with us',
              desc: 'Available 24/7',
              color: 'from-purple-500 to-violet-600',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
              <p className={`font-semibold text-sm mt-1 ${theme.accent}`}>{item.subtitle}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border ${theme.accentBorder} overflow-hidden`}>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.gradient} text-white`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h2>
                <p className="text-sm text-gray-500">Find quick answers to common questions</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
               
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${theme.accentBorder} bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium`}
              />
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                    openFaq === idx
                      ? `${theme.accentBorder} ${theme.accentBg} shadow-md`
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span className={`font-semibold text-sm pr-4 ${openFaq === idx ? theme.accent : 'text-gray-700'}`}>
                      {faq.q}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openFaq === idx ? `bg-gradient-to-br ${theme.gradient} text-white` : 'bg-gray-100 text-gray-500'
                    }`}>
                      {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 animate-fadeIn">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-8">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No matching questions found</p>
                  <p className="text-gray-400 text-sm mt-1">Try different keywords or contact us directly</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border ${theme.accentBorder} overflow-hidden`}>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.gradient} text-white`}>
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Send Us a Message</h2>
                <p className="text-sm text-gray-500">We'll get back to you as soon as possible</p>
              </div>
            </div>

            {formSubmitted ? (
              <div className="text-center py-10 animate-fadeIn">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center mx-auto mb-4`}>
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Message Sent!</h3>
                <p className="text-gray-500 text-sm mt-2">Thank you for reaching out. We'll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                   
                    className={`w-full px-4 py-3 rounded-xl border-2 ${theme.accentBorder} bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                   
                    className={`w-full px-4 py-3 rounded-xl border-2 ${theme.accentBorder} bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className={`${theme.buttonBg} text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2`}
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border ${theme.accentBorder} p-6 sm:p-8`}>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Quick Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { text: 'Getting Started Guide', icon: BookOpen, path: null },
              { text: 'Privacy Policy', icon: Shield, path: '/privacy-policy' },
              { text: 'Terms of Service', icon: FileText, path: '/terms-of-service' },
              { text: 'Report a Bug', icon: AlertCircle, path: null },
            ].map((link, idx) => (
              <button
                key={idx}
                onClick={() => link.path && navigate(link.path)}
                className={`flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:${theme.accentBg} hover:${theme.accentBorder} transition-all duration-300 hover:shadow-sm text-left group`}
              >
                <link.icon className={`w-4 h-4 text-gray-400 group-hover:${theme.accent} transition-colors`} />
                <span className="text-sm font-medium text-gray-600 flex-1">{link.text}</span>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs py-4">
          AegisCare &copy; 2026. All rights reserved.
        </div>
      </div>

      {/* CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HelpSupportPage;
