import React, { useEffect } from 'react';
import { ArrowLeft, FileText, Shield, Users, Brain, Scale, Globe, AlertTriangle, BookOpen, Clock, XCircle, RefreshCw, Gavel, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: '1. Acceptance of Terms',
      content: `By accessing or using AegisCare ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users including elderly individuals, caregivers, doctors, and administrators.`
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: '2. Description of Service',
      content: `AegisCare is an elderly care management platform that provides health monitoring, medication tracking, meal planning, appointment scheduling, cognitive assessments, and communication tools between elderly individuals, caregivers, and healthcare professionals. The Platform uses AI/ML-powered features for health risk assessment, anomaly detection, and nutrition recommendations.`
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: '3. User Accounts',
      content: `You must register for an account to use AegisCare. You agree to:
• Provide accurate, current, and complete information during registration
• Maintain the security of your password and account
• Use only one account per email address — duplicate accounts are not permitted
• Notify us immediately of any unauthorized access to your account
• Accept responsibility for all activities that occur under your account

We reserve the right to suspend or terminate accounts that violate these terms.`
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: '4. User Roles and Responsibilities',
      content: `AegisCare supports multiple user roles:

Elderly Users: Primary users whose health data is tracked and monitored.
Caregivers: Individuals assigned to monitor and assist elderly users. Caregivers must only access data for patients assigned to them.
Doctors: Licensed healthcare professionals who provide consultations and medical guidance. Doctors must maintain valid credentials.
Administrators: Platform administrators who manage users and system settings.

Each role has specific access permissions and responsibilities. Users must not attempt to access data or features outside their authorized role.`
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: '5. Health Data Disclaimer',
      content: `AegisCare is designed to assist in elderly care management but is NOT a substitute for professional medical advice, diagnosis, or treatment. AI-generated health risk assessments, anomaly detection alerts, and nutritional recommendations are informational only and should not replace consultation with qualified healthcare providers.

Never disregard professional medical advice or delay seeking treatment because of information provided through AegisCare.`
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: '6. AI/ML Features',
      content: `Our platform uses artificial intelligence and machine learning models for:
• Health risk assessment and prediction
• Vital signs anomaly detection
• Cognitive health evaluation
• Nutrition and meal recommendations

These models provide probabilistic assessments and may not always be accurate. Results should be used as supplementary information alongside professional medical judgment. We continuously work to improve model accuracy but do not guarantee the precision of AI-generated outputs.`
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      title: '7. Acceptable Use',
      content: `You agree NOT to:
• Use the Platform for any unlawful purpose
• Share your account credentials with others
• Attempt to access another user's data without authorization
• Upload malicious software or interfere with Platform operations
• Use automated tools to scrape or extract data from the Platform
• Misrepresent your identity, role, or professional credentials
• Use the Platform to harass, abuse, or harm other users`
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: '8. Intellectual Property',
      content: `All content, features, designs, source code, AI models, and functionality of AegisCare are owned by the AegisCare team and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from any part of the Platform without prior written consent.`
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: '9. Limitation of Liability',
      content: `AegisCare and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform. This includes, but is not limited to, damages resulting from reliance on AI-generated health assessments, data loss, unauthorized access due to user negligence, or service interruptions.

Our total liability shall not exceed the amount you have paid for using the Platform in the 12 months preceding the claim.`
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: '10. Service Availability',
      content: `We strive to maintain 24/7 availability but do not guarantee uninterrupted service. The Platform may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We will make reasonable efforts to notify users of planned downtime.`
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      title: '11. Termination',
      content: `We may suspend or terminate your access to AegisCare at any time for violations of these Terms, fraudulent activity, or any reason at our discretion. Upon termination, your right to use the Platform ceases immediately. You may request deletion of your account and personal data by contacting our support team.`
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: '12. Changes to Terms',
      content: `We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes via email or in-app notification. Continued use of the Platform after changes constitutes acceptance of the updated terms.`
    },
    {
      icon: <Gavel className="w-5 h-5" />,
      title: '13. Governing Law',
      content: `These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or use of the Platform shall be resolved through appropriate legal channels.`
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: '14. Contact Us',
      content: `If you have questions about these Terms of Service, please contact us at:
• Email: support@aegiscare.com
• Through the Contact Us page on our Platform`
    }
  ];

  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)' }}>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Go Back</span>
          </button>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Terms of Service</h1>
              <p className="text-white/80 text-sm mt-1">Last updated: April 5, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 space-y-6">
        {/* Intro Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-8">
          <p className="text-gray-600 leading-relaxed">
            Please read these Terms of Service carefully before using AegisCare. By creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300"
            style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                {section.icon}
              </div>
              <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-gray-600 text-sm">{section.content}</p>
          </div>
        ))}

        {/* Footer CTA */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-8 text-center">
          <p className="text-gray-600 mb-4">
            By creating an account on AegisCare, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </button>
        </div>

        {/* Footer text */}
        <div className="text-center text-gray-400 text-xs py-4">
          AegisCare &copy; 2026. All rights reserved.
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TermsOfService;
