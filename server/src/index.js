require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.SERVER_PORT || 5001;
const userRouter = require('./routes/user-auth-router');
const menuItemsRouter = require('./routes/menu-items-router');
const categoryRouter = require('./routes/category-router');
const cors = require('cors');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (dbError) => {
    if(dbError){
        console.log("Error while connecting to the DB", dbError);
        return process.exit(1);
    }

    return console.log("Connected to the MongoDB Database!");
})

// Middlewares configuration
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// Routers connection
app.use('/user/auth/', userRouter);
app.use('/menu/', menuItemsRouter);
app.use('/category', categoryRouter);

// Error handlers middlewares
app.use((req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    .send({
        success: false, 
        message: error.message || 'Internal server error'
    });
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}...`);
})