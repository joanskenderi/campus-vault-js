const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const prisma = require('../services/database');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

const authenticateJWT = passport.authenticate('jwt', { session: false });

module.exports = { authenticateJWT };
