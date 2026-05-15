/**
 * Validation utilities for AegisCare Authentication
 * Comprehensive checks for login and signup forms
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - must contain uppercase, lowercase, number, and special character
export const isValidPassword = (password) => {
  // Allow more special characters: @$!%*?&#-_+=.
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\-_+=.])[A-Za-z\d@$!%*?&#\-_+=.]{8,}$/;
  return passwordRegex.test(password);
};

// Basic password strength check (minimum 8 characters)
export const isStrongPassword = (password) => {
  return password.length >= 8;
};

// Phone number validation (basic international format)
export const isValidPhone = (phone) => {
  // Remove all non-digit characters and check if we have at least 10 digits
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
};

// Name validation (letters, spaces, hyphens only)
export const isValidName = (name) => {
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  return nameRegex.test(name.trim());
};

// Check if field is not empty
export const isNotEmpty = (value) => {
  return value.trim().length > 0;
};

// Specific validators with detailed messages
export const validationRules = {
  email: (value) => {
    if (!value.trim()) return 'Email is required';
    if (!isValidEmail(value)) return 'Please enter a valid email address';
    return null;
  },

  password: (value, skipStrength = false) => {
    if (!value) return 'Password is required';
    if (!isStrongPassword(value)) return 'Password must be at least 8 characters long';
    if (!skipStrength && !isValidPassword(value)) {
      return 'Password must contain uppercase, lowercase, number, and special character (e.g., @, $, !, %, *, ?, &, #, -, _, +, =, .)';
    }
    return null;
  },

  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  },

  phone: (value) => {
    if (!value.trim()) return 'Phone number is required';
    if (!isValidPhone(value)) return 'Please enter a valid phone number (at least 10 digits)';
    return null;
  },

  firstName: (value) => {
    if (!value.trim()) return 'First name is required';
    if (!isValidName(value)) return 'First name must contain only letters, spaces, and hyphens (2-50 characters)';
    return null;
  },

  lastName: (value) => {
    if (!value.trim()) return 'Last name is required';
    if (!isValidName(value)) return 'Last name must contain only letters, spaces, and hyphens (2-50 characters)';
    return null;
  },

  specialization: (value) => {
    if (!value.trim()) return 'Specialization is required';
    if (value.trim().length < 2) return 'Specialization must be at least 2 characters';
    return null;
  },

  licenseNumber: (value) => {
    if (!value.trim()) return 'License number is required';
    const licenseRegex = /^[A-Z0-9\-]{3,20}$/;
    if (!licenseRegex.test(value.trim())) return 'License number format is invalid (3-20 alphanumeric characters)';
    return null;
  },

  dateOfBirth: (value) => {
    if (!value) return null; // Optional field
    const date = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    if (age < 18) return 'You must be at least 18 years old';
    if (age > 120) return 'Please enter a valid date of birth';
    return null;
  },

  address: (value) => {
    if (value && value.trim().length > 0 && value.trim().length < 5) {
      return 'Address must be at least 5 characters';
    }
    return null;
  }
};

// Get password strength indicator
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'none', color: 'gray', percentage: 0 };

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  Object.values(checks).forEach(check => {
    if (check) strength++;
  });

  if (strength === 1) return { strength: 'weak', color: 'red', percentage: 20 };
  if (strength === 2) return { strength: 'fair', color: 'orange', percentage: 40 };
  if (strength === 3) return { strength: 'good', color: 'yellow', percentage: 60 };
  if (strength === 4) return { strength: 'strong', color: 'light-green', percentage: 80 };
  if (strength === 5) return { strength: 'very-strong', color: 'green', percentage: 100 };

  return { strength: 'none', color: 'gray', percentage: 0 };
};

// Validate entire form
export const validateLoginForm = (formData, loginMethod) => {
  const errors = {};

  // Temporary bypass for testing
  if (formData.email === 'umer' && formData.password === 'care123') {
    return errors;
  }

  if (loginMethod === 'email') {
    const emailError = validationRules.email(formData.email);
    if (emailError) errors.email = emailError;
  } else {
    const phoneError = validationRules.phone(formData.email);
    if (phoneError) errors.email = phoneError;
  }

  const passwordError = validationRules.password(formData.password, true);
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateSignupForm = (formData) => {
  const errors = {};

  // Basic fields
  const firstNameError = validationRules.firstName(formData.firstName);
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validationRules.lastName(formData.lastName);
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validationRules.email(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validationRules.password(formData.password, false);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validationRules.confirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  const phoneError = validationRules.phone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  // Optional fields
  if (formData.dateOfBirth) {
    const dobError = validationRules.dateOfBirth(formData.dateOfBirth);
    if (dobError) errors.dateOfBirth = dobError;
  }

  if (formData.address) {
    const addressError = validationRules.address(formData.address);
    if (addressError) errors.address = addressError;
  }

  // Role-specific fields
  if (formData.role === 'doctor') {
    const specializationError = validationRules.specialization(formData.specialization);
    if (specializationError) errors.specialization = specializationError;

    const licenseError = validationRules.licenseNumber(formData.licenseNumber);
    if (licenseError) errors.licenseNumber = licenseError;
  }

  // Terms agreement
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions';
  }

  return errors;
};

// Real-time field validation
export const validateField = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'email':
      return validationRules.email(value);
    case 'password':
      return validationRules.password(value, false);
    case 'confirmPassword':
      return validationRules.confirmPassword(formData.password, value);
    case 'phone':
      return validationRules.phone(value);
    case 'firstName':
      return validationRules.firstName(value);
    case 'lastName':
      return validationRules.lastName(value);
    case 'specialization':
      return validationRules.specialization(value);
    case 'licenseNumber':
      return validationRules.licenseNumber(value);
    case 'dateOfBirth':
      return validationRules.dateOfBirth(value);
    case 'address':
      return validationRules.address(value);
    default:
      return null;
  }
};
