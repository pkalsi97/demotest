const express = require('express');
const sequelize = require('./config/database');
const { register, login, logout } = require('./controllers/authController');
const { protect } = require('./middlewares/authMiddleware');

const app = express();
app.use(express.json());

app.post('/register', register);
app.post('/login', login);
app.post('/logout', logout);

app.get('/dashboard', protect, (req, res) => {
    res.json({ message: 'Welcome to the dashboard', user: req.user });
});

const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
