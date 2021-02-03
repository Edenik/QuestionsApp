class User {
  constructor(email, username, password, role = "user", id) {
    this.email = email;
    this.username = username;
    this.role = role;
    this.highscore = 0;
    this.password = password;
    this.id = id;
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
}

module.exports = User;
