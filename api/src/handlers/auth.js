const jwt = require('jsonwebtoken');
const passport = require('passport');

const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      console.log('Authentication failed:', info.message);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token if auth succeeds
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2 days' }
    );

    res.json({ token });
  })(req, res, next);
};

module.exports = {
  login,
};
