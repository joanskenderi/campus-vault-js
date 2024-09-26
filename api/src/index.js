const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');

const { authenticateJWT } = require('./middlewares/authenticateJWT');

const { router: authRouter } = require('./routes/auth');
const notificationsRouter = require('./routes/notifications');
const usersRouter = require('./routes/users');
const timetablesRouter = require('./routes/timetables');
const gradesRouter = require('./routes/grades');
const studyProgramsRouter = require('./routes/studyPrograms');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/', authRouter);
app.use('/notifications', notificationsRouter);
app.use('/users', authenticateJWT, usersRouter);
app.use('/timetables', authenticateJWT, timetablesRouter);
app.use('/grades', authenticateJWT, gradesRouter);
app.use('/study-programs', authenticateJWT, studyProgramsRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running on port ${port}`);
});
