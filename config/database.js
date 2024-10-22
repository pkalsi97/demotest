const { Sequelize } = require('sequelize');
require('dotenv').config();

// Load CA Certificate if present
let caCert;
if (process.env.CA_CERT) {
    caCert = process.env.CA_CERT.replace(/\\n/g, '\n').replace(/"/g, '');
}

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: console.log, // Enable logging for SQL queries
    dialectOptions: {
        ssl: process.env.SSL_MODE === 'REQUIRED' ? {
            rejectUnauthorized: true,
            ca: caCert ? [caCert] : undefined, // Include CA cert only if defined
        } : false,
    },
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err.message || err);
    });

// Sync the database (optional, uncomment if needed)
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true }); // Use { force: true } only in development
        console.log('Database & tables synced successfully!');
    } catch (error) {
        console.error('Error syncing database:', error.message || error);
    }
}

// Call the sync function (optional)
syncDatabase();

module.exports = sequelize;
