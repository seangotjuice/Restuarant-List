const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
module.exports = (app) => {
  // 初始化passport module
  app.use(passport.initialize());
  app.use(passport.session());
  // 設定LocalStrategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                mseeage: "That email is not registered",
              });
            }
            if (user.password !== password) {
              return done(null, false, {
                message: "email or password incorrect!",
              });
            }
            return done(null, user);
          })
          .catch((err) => done(err, false));
      }
    )
  );
  // 序列化、反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
