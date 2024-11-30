const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());


const propertyRoute = require("./routes/property");
const userRoute = require("./routes/user");
// const userRoute = require("./routes/user");

// app.use("/user", userRoute);
app.use("/property", propertyRoute);
app.use("/user", userRoute);

dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => console.log(err));

app.get('/api', (req, res) => {
    console.log('Request!\n');
    res.send('Hello, World!');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
