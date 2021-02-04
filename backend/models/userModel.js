const bcrypt = require("bcryptjs");

class User {
  constructor(email, username, password, role = "user", id, passwordChangedAt) {
    this.email = email;
    this.username = username;
    this.role = role;
    this.highscore = 0;
    this.password = password;
    this.id = id;
    this.passwordChangedAt = passwordChangedAt;
  }

  getEmail() {
    return this.email.toLowerCase();
  }

  setEmail(email) {
    this.email = email;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username) {
    this.username = username;
  }

  getPassword() {
    return this.password;
  }

  async setPassword(password) {
    this.password = password;
  }

  getRole() {
    return this.role;
  }

  setRole(role) {
    this.role = role;
  }

  getHighscore() {
    return this.highscore;
  }

  setHighscore(highscore) {
    this.highscore = highscore || 0;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  async checkPassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  getPasswordChangedAt() {
    return this.passwordChangedAt;
  }

  setPasswordChangedAt(date) {
    this.passwordChangedAt = date;
  }
  changedPasswordAfterLogin(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  }
}

module.exports = User;
