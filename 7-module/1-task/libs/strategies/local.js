const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

class AccessDenied extends Error {
  constructor(message) {
    super('Access Denied');
    this.status = 403;
    this.expose = true;
    this.message = message;
  }
}

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const user = await User.findOne({email: email});

      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }

      const isPasswordValid = await user.checkPassword(password);

      if (!isPasswordValid) {
        return done(null, false, 'Неверный пароль');
      }

      done(null, user);
    }
);
