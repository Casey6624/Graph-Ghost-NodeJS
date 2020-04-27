const validateEmail = (input) => {
  if (input.trim().includes("@") && input.trim().includes(".")) {
    return true;
  } else {
    return false;
  }
};

const validateUrl = (input) => {
  if (input.trim().includes("http") && input.trim().includes(".")) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  validateEmail: validateEmail,
  validateUrl: validateUrl,
};
