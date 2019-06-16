"use strict";

class register {
  get sanitizationRules() {
    return {
      email: "normalize_email"
    };
  }

  get validateAll() {
    return true;
  }

  get rules() {
    return {
      email: "required|min:6",
      name: "required|min:6",
      password: "required|min:6|same:passwordConfirmation",
      passwordConfirmation: "required|min:6"
    };
  }

  get messages() {
    return {
      "name.required": "name field is required.",
      "email.required": "email field is required.",
      "password.required": "password field is required.",
      "passwordConfirmation.required":
        "password confirmation field is required.",
      "email.min": "email requires minimum of 6 characters.",
      "password.min": "password requires minimum of 6 characters.",
      "password.same": "password does not match."
    };
  }
}

module.exports = register;
