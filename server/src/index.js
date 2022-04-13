require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.SERVER_PORT || 5001;
const userRouter = require('./routes/user-auth-router');
const menuItemsRouter = require('./routes/menu-items-router');
const categoryRouter = require('./routes/category-router');
const uploadImageRouter = require('./routes/upload-image-router');
const otpRouter = require('./routes/otp-router');
const cors = require('cors');
const apiErrorHandler = require('./error/apiErrorHandler');
const morgan = require('morgan');

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
app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));

// Routers connection
app.use('/user/auth/', userRouter);
app.use('/menu/', menuItemsRouter);
app.use('/category', categoryRouter);
app.use('/upload', uploadImageRouter);
app.use('/otp', otpRouter);

// Error handlers middlewares
app.use(apiErrorHandler);

app.use((req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    console.log("Something", error);
    res.status(error.status || 500)
    .send({
        success: false, 
        message: error.message || 'Internal server error'
    });
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}...`);
})