const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // This should be at the very top

// Debugging logs to verify environment variables
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Passport
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My Project API',
            version: '1.0.0',
            description: 'API documentation for My Project',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(err => {
        console.error('Connection error', err.message);
    });