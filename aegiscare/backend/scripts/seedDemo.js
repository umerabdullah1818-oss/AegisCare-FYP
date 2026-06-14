/**
 * AegisCare - Demo Data Seed Script
 * ===================================
 * Creates demo users with varied health profiles so the ML insights
 * show up on Doctor, Caregiver, and Elderly dashboards during a demo.
 *
 * Usage:  cd backend && node scripts/seedDemo.js
 *
 * Demo Login Credentials (after seeding):
 * ----------------------------------------
 *   Doctor:     doctor@demo.com    / Demo@123
 *   Caregiver:  caregiver@demo.com / Demo@123
 *   Elderly 1:  fatima@demo.com    / Demo@123  (Healthy)
 *   Elderly 2:  ahmed@demo.com     / Demo@123  (Moderate risk)
 *   Elderly 3:  zainab@demo.com    / Demo@123  (High risk)
 *   Elderly 4:  aslam@demo.com     / Demo@123  (Critical)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/user');
const { Medication } = require('../models/medication');
const Meal = require('../models/meal');

const DEMO_PASSWORD = 'Demo@123';

// Helper: date years ago from today
function yearsAgo(y) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - y);
  return d;
}

// Helper: today at specific hour
function todayAt(hour, minute = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', mongoose.connection.name);

    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    // =============================
    // 1. Clean up previous demo data
    // =============================
    const demoEmails = [
      'doctor@demo.com', 'caregiver@demo.com',
      'fatima@demo.com', 'ahmed@demo.com', 'zainab@demo.com', 'aslam@demo.com'
    ];
    const existingUsers = await User.find({ email: { $in: demoEmails } });
    const existingIds = existingUsers.map(u => u._id);

    if (existingIds.length > 0) {
      await Medication.deleteMany({ userId: { $in: existingIds } });
      await Meal.deleteMany({ userId: { $in: existingIds } });
      await User.deleteMany({ _id: { $in: existingIds } });
      console.log(`Cleaned up ${existingIds.length} previous demo users and their data.`);
    }

    // =============================
    // 2. Create Doctor
    // =============================
    const doctor = await User.create({
      firstName: 'Sarah',
      lastName: 'Ahmed',
      email: 'doctor@demo.com',
      password: hashedPassword,
      phone: '03001234567',
      role: 'doctor',
      specialization: 'Geriatric Medicine',
      status: 'active',
    });
    console.log('Created Doctor: Dr. Sarah Ahmed');

    // =============================
    // 3. Create Caregiver
    // =============================
    const caregiver = await User.create({
      firstName: 'Ali',
      lastName: 'Hassan',
      email: 'caregiver@demo.com',
      password: hashedPassword,
      phone: '03009876543',
      role: 'caregiver',
      status: 'active',
    });
    console.log('Created Caregiver: Ali Hassan');

    // =============================
    // 4. Create Elderly Patients
    // =============================
    const elderlyProfiles = [
      {
        firstName: 'Fatima', lastName: 'Bibi',
        email: 'fatima@demo.com', phone: '03001111111',
        dateOfBirth: yearsAgo(68),
        // HEALTHY: 1 medication, normal vitals expected
        medications: [
          { name: 'Vitamin D', type: 'Supplement', dosage: '1000 IU', frequency: 'daily', scheduledTime: '8:00 AM' },
        ],
        meals: [
          { name: 'Oatmeal with Fresh Fruits', mealType: 'breakfast', scheduledTime: '8:00 AM', calories: 320, protein: 12, carbs: 55, fats: 8 },
          { name: 'Grilled Chicken Salad', mealType: 'lunch', scheduledTime: '1:00 PM', calories: 450, protein: 35, carbs: 20, fats: 18 },
          { name: 'Steamed Fish with Vegetables', mealType: 'dinner', scheduledTime: '7:00 PM', calories: 380, protein: 30, carbs: 25, fats: 12 },
        ],
      },
      {
        firstName: 'Ahmed', lastName: 'Khan',
        email: 'ahmed@demo.com', phone: '03002222222',
        dateOfBirth: yearsAgo(74),
        // MODERATE: 3 medications, borderline vitals
        medications: [
          { name: 'Metformin', type: 'Diabetes', dosage: '500mg', frequency: 'twice-daily', scheduledTime: '8:00 AM' },
          { name: 'Lisinopril', type: 'Blood Pressure', dosage: '10mg', frequency: 'daily', scheduledTime: '9:00 AM' },
          { name: 'Atorvastatin', type: 'Cholesterol', dosage: '20mg', frequency: 'daily', scheduledTime: '9:00 PM' },
        ],
        meals: [
          { name: 'Whole Wheat Toast with Egg Whites', mealType: 'breakfast', scheduledTime: '8:00 AM', calories: 280, protein: 18, carbs: 35, fats: 6 },
          { name: 'Lentil Soup with Brown Rice', mealType: 'lunch', scheduledTime: '1:00 PM', calories: 420, protein: 22, carbs: 60, fats: 10 },
          { name: 'Baked Chicken with Steamed Broccoli', mealType: 'dinner', scheduledTime: '7:00 PM', calories: 400, protein: 32, carbs: 20, fats: 14 },
        ],
      },
      {
        firstName: 'Zainab', lastName: 'Noor',
        email: 'zainab@demo.com', phone: '03003333333',
        dateOfBirth: yearsAgo(80),
        // HIGH RISK: 5 medications, concerning vitals
        medications: [
          { name: 'Insulin Glargine', type: 'Diabetes', dosage: '20 units', frequency: 'daily', scheduledTime: '7:00 AM' },
          { name: 'Amlodipine', type: 'Blood Pressure', dosage: '10mg', frequency: 'daily', scheduledTime: '8:00 AM' },
          { name: 'Warfarin', type: 'Blood Thinner', dosage: '5mg', frequency: 'daily', scheduledTime: '6:00 PM' },
          { name: 'Furosemide', type: 'Diuretic', dosage: '40mg', frequency: 'daily', scheduledTime: '8:00 AM' },
          { name: 'Albuterol Inhaler', type: 'COPD', dosage: '2 puffs', frequency: 'as-needed', scheduledTime: '8:00 AM' },
        ],
        meals: [
          { name: 'Soft Scrambled Eggs with Toast', mealType: 'breakfast', scheduledTime: '8:30 AM', calories: 300, protein: 16, carbs: 30, fats: 14 },
          { name: 'Vegetable Khichdi (Soft)', mealType: 'lunch', scheduledTime: '1:00 PM', calories: 350, protein: 14, carbs: 55, fats: 8 },
          { name: 'Mashed Potatoes with Gravy', mealType: 'dinner', scheduledTime: '6:30 PM', calories: 320, protein: 10, carbs: 45, fats: 12 },
        ],
      },
      {
        firstName: 'Mohammad', lastName: 'Aslam',
        email: 'aslam@demo.com', phone: '03004444444',
        dateOfBirth: yearsAgo(85),
        // CRITICAL: 7 medications, bad vitals
        medications: [
          { name: 'Insulin Lispro', type: 'Diabetes', dosage: '15 units', frequency: 'twice-daily', scheduledTime: '7:00 AM' },
          { name: 'Losartan', type: 'Blood Pressure', dosage: '50mg', frequency: 'daily', scheduledTime: '8:00 AM' },
          { name: 'Metoprolol', type: 'Heart', dosage: '50mg', frequency: 'twice-daily', scheduledTime: '8:00 AM' },
          { name: 'Aspirin', type: 'Blood Thinner', dosage: '81mg', frequency: 'daily', scheduledTime: '8:00 AM' },
          { name: 'Nitroglycerin', type: 'Heart', dosage: '0.4mg', frequency: 'as-needed', scheduledTime: '8:00 AM' },
          { name: 'Prednisone', type: 'Anti-inflammatory', dosage: '10mg', frequency: 'daily', scheduledTime: '9:00 AM' },
          { name: 'Omeprazole', type: 'Stomach', dosage: '20mg', frequency: 'daily', scheduledTime: '7:00 AM' },
        ],
        meals: [
          { name: 'Porridge with Honey', mealType: 'breakfast', scheduledTime: '9:00 AM', calories: 250, protein: 8, carbs: 45, fats: 5 },
          { name: 'Soft Rice with Yogurt', mealType: 'lunch', scheduledTime: '1:30 PM', calories: 300, protein: 12, carbs: 50, fats: 6 },
          { name: 'Soup with Bread', mealType: 'dinner', scheduledTime: '6:00 PM', calories: 280, protein: 10, carbs: 40, fats: 8 },
        ],
      },
    ];

    for (const profile of elderlyProfiles) {
      // Create elderly user
      const elderly = await User.create({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        password: hashedPassword,
        phone: profile.phone,
        role: 'elderly',
        dateOfBirth: profile.dateOfBirth,
        assignedDoctor: doctor._id,
        assignedCaregivers: [caregiver._id],
        status: 'active',
      });

      // Create medications
      for (const med of profile.medications) {
        await Medication.create({
          userId: elderly._id,
          name: med.name,
          type: med.type,
          dosage: med.dosage,
          frequency: med.frequency,
          scheduledTime: med.scheduledTime,
          prescribedBy: `Dr. Sarah Ahmed`,
          isActive: true,
          approvalStatus: 'approved',
          approvedBy: doctor._id,
          startDate: yearsAgo(1),
        });
      }

      // Create today's meals
      for (const meal of profile.meals) {
        await Meal.create({
          userId: elderly._id,
          name: meal.name,
          mealType: meal.mealType,
          scheduledTime: meal.scheduledTime,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          status: 'upcoming',
          date: today,
          approvalStatus: 'approved',
          approvedBy: doctor._id,
        });
      }

      const age = Math.floor((Date.now() - profile.dateOfBirth.getTime()) / 31557600000);
      console.log(`Created Elderly: ${profile.firstName} ${profile.lastName} (age ${age}, ${profile.medications.length} meds)`);
    }

    // =============================
    // Summary
    // =============================
    console.log('\n========================================');
    console.log('  DEMO DATA SEEDED SUCCESSFULLY!');
    console.log('========================================');
    console.log('');
    console.log('  Login Credentials (password for all: Demo@123)');
    console.log('  -----------------------------------------------');
    console.log('  Doctor:      doctor@demo.com');
    console.log('  Caregiver:   caregiver@demo.com');
    console.log('  Elderly 1:   fatima@demo.com    (Healthy - 1 med)');
    console.log('  Elderly 2:   ahmed@demo.com     (Moderate - 3 meds)');
    console.log('  Elderly 3:   zainab@demo.com    (High Risk - 5 meds)');
    console.log('  Elderly 4:   aslam@demo.com     (Critical - 7 meds)');
    console.log('');
    console.log('  Demo Steps:');
    console.log('  1. Start ML service:  cd ml-service && python app.py');
    console.log('  2. Start backend:     cd backend && node server.js');
    console.log('  3. Start frontend:    cd frontend && npm run dev');
    console.log('  4. Login as doctor@demo.com to see all patients with ML insights');
    console.log('  5. Login as caregiver@demo.com to see alerts and anomalies');
    console.log('  6. Login as any elderly to see personal health insights');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
