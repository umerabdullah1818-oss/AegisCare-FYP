import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Database, Lock, Share2, Brain, Clock, UserCheck, HardDrive, Baby, Mail, RefreshCw, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <Database className="w-5 h-5" />,
      title: '1. Information We Collect',
      content: `We collect the following types of information:

Personal Information:
• Full name, email address, phone number, date of birth
• Role (elderly, caregiver, doctor, or administrator)
• Profile picture (optional)
• Address and contact details
• For doctors: specialization and license number

Health Data:
• Vital signs (heart rate, blood pressure, temperature, oxygen saturation)
• Medication schedules and adherence logs
• Meal and nutrition data
• Cognitive assessment results
• Appointment records and consultation notes

Account Data:
• Login credentials (passwords are hashed and never stored in plain text)
• Authentication tokens and session data
• Google account information (if using Google Sign-In)`
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: '2. How We Use Your Information',
      content: `We use collected information for the following purposes:

• Providing and maintaining the AegisCare platform
• Health monitoring and vital signs tracking for elderly users
• AI/ML-powered health risk assessments and anomaly detection
• Cognitive health evaluation and trend analysis
• Personalized nutrition recommendations and meal planning
• Appointment scheduling and management
• Communication between caregivers, doctors, and elderly users
• Sending notifications and alerts (health alerts, medication reminders, appointment reminders)
• Password reset and account recovery via email
• Improving our AI models and platform functionality
• Ensuring platform security and preventing unauthorized access`
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: '3. Data Protection & Security',
      content: `We implement robust security measures to protect your data:

• Passwords are hashed using bcrypt with salt rounds before storage
• Sensitive personal fields (phone numbers) are encrypted using AES-256 encryption
• Password reset tokens are hashed using SHA-256 before storage
• JWT (JSON Web Tokens) are used for secure session authentication
• All API communications use secure HTTP headers
• Access controls ensure users can only view data authorized for their role
• Database connections use secure configurations

We regularly review and update our security practices to maintain data protection standards.`
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: '4. Data Sharing',
      content: `We do NOT sell, trade, or rent your personal information to third parties.

Your data may be shared in the following limited circumstances:

Within the Platform:
• Elderly users' health data is shared with their assigned caregivers and doctors
• Doctors can view health records of patients assigned to them
• Caregivers can monitor elderly users linked to their account
• Administrators can view user account information for management purposes

Third-Party Services:
• Google OAuth (if you choose to sign in with Google) — only authentication data
• Email service provider (for password reset emails and notifications)
• No health data is shared with external third parties

Legal Requirements:
• We may disclose information if required by law or in response to valid legal processes`
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: '5. AI/ML Data Processing',
      content: `AegisCare uses artificial intelligence and machine learning to process health data:

• Health risk prediction models analyze vital signs patterns
• Anomaly detection identifies unusual vital sign readings
• Cognitive assessment models evaluate cognitive health trends
• Nutrition models generate personalized meal recommendations

Important notes about AI processing:
• AI models run on our servers — your data is not sent to external AI services
• Model predictions are probabilistic and used as supplementary health information
• We use anonymized and aggregated data to improve model accuracy
• You can request information about how AI decisions affecting you were made`
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: '6. Data Retention',
      content: `We retain your data as follows:

• Account information: Retained while your account is active
• Health records: Retained for the duration of your account for historical tracking
• Password reset tokens: Expire after 1 hour and are automatically cleared
• Session tokens: Expire after 7 days
• Deleted account data: Permanently removed upon account deletion request

You can request complete deletion of your account and all associated data at any time through your account settings or by contacting support.`
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: '7. Your Rights',
      content: `You have the following rights regarding your personal data:

• Access: Request a copy of the personal data we hold about you
• Correction: Request correction of inaccurate or incomplete data
• Deletion: Request deletion of your account and all associated data
• Restriction: Request restriction of processing of your data
• Portability: Request your data in a portable format
• Objection: Object to processing of your data for specific purposes
• Withdraw Consent: Withdraw consent for data processing at any time

To exercise any of these rights, contact us through the Contact Us page or email support@aegiscare.com.`
    },
    {
      icon: <HardDrive className="w-5 h-5" />,
      title: '8. Cookies and Local Storage',
      content: `AegisCare uses browser local storage to:

• Store authentication tokens for maintaining your login session
• Store user preferences (dark mode setting)
• Store role information for proper dashboard routing

We do not use tracking cookies or third-party analytics cookies. No data is shared with advertising networks.`
    },
    {
      icon: <Baby className="w-5 h-5" />,
      title: '9. Children\'s Privacy',
      content: `AegisCare is designed for elderly care management and is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If we discover that we have collected data from a child under 18, we will delete it promptly.`
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: '10. Email Communications',
      content: `We may send you emails for:

• Password reset requests (only when you request them)
• Important account notifications (security alerts, policy changes)
• Health-related alerts and reminders (if configured)

We do not send marketing or promotional emails. All email communications are essential to the functioning of your account and the platform's services.`
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: '11. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by:

• Posting the updated policy on our platform
• Sending an email notification to your registered email address
• Displaying a notice in the application

Your continued use of AegisCare after changes are posted constitutes acceptance of the updated policy. We encourage you to review this policy periodically.`
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: '12. Contact Us',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

• Email: support@aegiscare.com
• Through the Contact Us page on our Platform

We will respond to your inquiry within a reasonable timeframe.`
    }
  ];

  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)' }}>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
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
            <Shield className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-white/80 text-sm mt-1">Last updated: April 5, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 space-y-6">
        {/* Intro Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-100 p-6 sm:p-8">
          <p className="text-gray-600 leading-relaxed">
            Your privacy is important to us. This policy explains how AegisCare collects, uses, and protects your personal information and health data. We are committed to safeguarding your data with industry-standard security practices.
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                {section.icon}
              </div>
              <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-gray-600 text-sm">{section.content}</p>
          </div>
        ))}

        {/* Footer CTA */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-100 p-6 sm:p-8 text-center">
          <p className="text-gray-600 mb-4">
            By using AegisCare, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl"
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

export default PrivacyPolicy;
