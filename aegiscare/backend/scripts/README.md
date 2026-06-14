# Admin Management Scripts

This directory contains scripts for managing admin users in the AegisCare system.

## 📁 Scripts Overview

### 1. **seedAdmin.js** - Add Admin Users
Seeds the database with initial admin users without deleting existing ones.

**Usage:**
```bash
npm run seed-admin
```

**What it does:**
- Connects to MongoDB
- Checks if admins already exist (prevents duplicates)
- Creates new admin users with hashed passwords
- Displays created admin information
- Shows total admin count

**Default Admins Created:**
1. **John Admin**
   - Email: `admin@aegiscare.com`
   - Password: `Admin@123456`
   - Permissions: All (manage_users, manage_system, view_analytics, manage_settings)

2. **Sarah Manager**
   - Email: `manager@aegiscare.com`
   - Password: `Manager@123456`
   - Permissions: Limited (manage_users, view_analytics)

---

### 2. **resetAdmins.js** - Reset All Admins
Deletes ALL existing admin users and re-seeds with default admin users.

⚠️ **WARNING:** This will delete all admin users in the database!

**Usage:**
```bash
npm run reset-admins
```

**When to use:**
- Development/Testing environment only
- Need to restore default admin accounts
- Start fresh with clean admin data

**Safety Feature:**
- 3-second delay before execution
- Can be cancelled with Ctrl+C

---

### 3. **viewAdmins.js** - View All Admins
Displays detailed information about all admin users in the database.

**Usage:**
```bash
npm run view-admins
```

**Shows:**
- Admin name and email
- Phone number
- MongoDB ID
- Active status
- Permissions list
- Creation date
- Last login time

---

## 🚀 Quick Start Guide

### First Time Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Seed admin users:**
   ```bash
   npm run seed-admin
   ```

3. **View all admins:**
   ```bash
   npm run view-admins
   ```

### Login with Seeded Admin

Once admins are seeded, use these credentials:

**Admin Account:**
- Email: `admin@aegiscare.com`
- Password: `Admin@123456`

**Manager Account:**
- Email: `manager@aegiscare.com`
- Password: `Manager@123456`

---

## 📋 Step-by-Step: Adding Admin Credentials

### Step 1: Start Backend Server
```bash
npm run dev
```

### Step 2: Run Seed Script (in another terminal)
```bash
npm run seed-admin
```

### Step 3: Verify Admins Created
```bash
npm run view-admins
```

### Step 4: Test Admin Login
- Use the email and password from the seeded admin
- Call: `POST /api/admin/login`
- Payload:
  ```json
  {
    "email": "admin@aegiscare.com",
    "password": "Admin@123456"
  }
  ```

---

## 🔐 Customizing Admin Users

To add custom admin users, edit `seedAdmin.js`:

```javascript
const adminsToSeed = [
  {
    firstName: 'Your Name',
    lastName: 'Your Surname',
    email: 'your.email@aegiscare.com',
    password: 'YourSecurePassword123',
    phone: '+1-XXX-XXX-XXXX',
    permissions: ['manage_users', 'manage_system', 'view_analytics', 'manage_settings']
  }
];
```

Then run:
```bash
npm run seed-admin
```

---

## 📊 Available Permissions

Admin users can have these permissions:
- `manage_users` - Manage user accounts
- `manage_system` - Manage system settings
- `view_analytics` - View analytics and reports
- `manage_settings` - Manage application settings

---

## 🛠️ API Endpoints

### Admin Login
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@aegiscare.com",
  "password": "Admin@123456"
}
```

### Admin Register (System-only)
```
POST /api/admin/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Admin",
  "email": "admin@aegiscare.com",
  "password": "SecurePassword123",
  "phone": "+1-800-123-4567",
  "permissions": ["manage_users", "manage_system", "view_analytics", "manage_settings"]
}
```

### Get Admin Profile
```
GET /api/admin/profile/:id
Authorization: Bearer <token>
```

### Update Admin Profile
```
PUT /api/admin/profile/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name",
  "phone": "+1-800-999-9999"
}
```

---

## ✅ Troubleshooting

### Issue: "MongoDB connection error"
**Solution:** Ensure `.env` file has correct `MONGODB_URI`

### Issue: "Admin already exists"
**Solution:** Run `npm run reset-admins` to start fresh

### Issue: "Scripts not found"
**Solution:** Ensure you're in the `backend` directory

### Issue: "Admin model not found"
**Solution:** Check that `/models/admin.js` exists

---

## 📚 Database Schema

```javascript
{
  firstName: String,           // Required
  lastName: String,            // Required
  email: String,               // Required, unique
  password: String,            // Required, hashed with bcrypt
  phone: String,               // Required
  role: String,                // Always "admin"
  permissions: [String],       // Array of permissions
  isActive: Boolean,           // True/False
  lastLogin: Date,             // Timestamp of last login
  createdAt: Date,             // Creation timestamp
  updatedAt: Date              // Last update timestamp
}
```

---

## 🔄 Common Workflows

### Workflow 1: Fresh Project Setup
```bash
npm install              # Install dependencies
npm run seed-admin       # Create admin users
npm run view-admins      # Verify admins created
npm run dev              # Start server
```

### Workflow 2: Reset for Testing
```bash
npm run reset-admins     # Delete and recreate all admins
npm run view-admins      # Verify reset
```

### Workflow 3: Add Single New Admin
```bash
# Edit seedAdmin.js and add to adminsToSeed array
npm run seed-admin       # Run seeding
npm run view-admins      # Verify added
```

---

## 💡 Best Practices

✅ Use strong passwords (minimum 8 characters, mix of letters, numbers, symbols)  
✅ Change default admin passwords after first login  
✅ Use `npm run view-admins` periodically to audit admins  
✅ Back up database before running `npm run reset-admins`  
✅ Keep `.env` file secure and never commit to Git  
✅ Use role-based permissions for security  

---

## 📞 Support

For issues or questions about admin management:
1. Check troubleshooting section above
2. Verify MongoDB connection
3. Review `.env` configuration
4. Check admin model schema

---

**Created:** December 2025  
**Last Updated:** December 2025
