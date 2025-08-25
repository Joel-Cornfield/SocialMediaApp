const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors")
require("dotenv-flow").config()
const apiRouter = require("./routes/mainRouter")

const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit")

const app = express();

// Move CORS to the very top
app.use(cors({
  origin: [
    process.env.CLIENT_URL_1,
    process.env.CLIENT_URL_2,
    "http://127.0.0.1:5173",
    "http://localhost:5173"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Explicitly handle preflight for socket.io
app.options("/socket.io/*", cors());

const limiter = RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 50
})

/**
 * ======================== MIDDLEWARE ========================
 */
app.use(compression())
app.use(helmet());
app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * ======================== ROUTES ========================
 */

app.use("/api",apiRouter)


/**
 * ======================== ERROR HANDLER ========================
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((err,req,res,next)=>{ 
  res.header("Content-Type","application/json")
  res.status(err.status || 400).json({error:err.message} || 'Something went wrong.')
})

module.exports = app;
