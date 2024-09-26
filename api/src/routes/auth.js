const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const prisma = require('../services/database');
const { login } = require('../handlers/auth');

const router = express.Router();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log('User not found');
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          console.log('Invalid password');
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (err) {
        console.log('Error during authentication:', err);
        return done(err);
      }
    }
  )
);

router.post('/login', login);

module.exports = { router };
