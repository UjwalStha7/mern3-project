require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const connectDB = require('./database/index.js');

app.use(express.json());

connectDB();    

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post("/blog", (req, res) => {
    console.log(req.body);
    res.send("Blog api hit successfully");
});

app.listen(port, () => {  
    console.log(`App listening at http://localhost:${port}`);
});
