// Function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password
const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (!/\d/.test(password)) {
    return "Password must contain at least one digit";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }

  // If all validations pass, return null
  return null;
};

const validateRequiredFields = (fields) => {
    for (const field of fields) {
      if (!field.value) {
        return { success: false, message: `${field.name} is required` };
      }
    }
    return { success: true };
  };

module.exports = { validatePassword, isValidEmail , validateRequiredFields };
