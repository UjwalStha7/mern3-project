require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const connectDB = require('./database/index.js');
const Blog = require('./model/blogModel.js');

app.use(express.json());

connectDB();    

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post("/blog", async (req, res) => {
    //console.log(req.body);
    const { title, description, subtitle, image} = req.body;
    if(!title || !description || !subtitle || !image){
        return res.status(400).json({
            message : "Please provide all the required fields"
        });
    }
    await Blog.create({
        title : title,  //if name of key and value is same we can just write title
        description : description,
        subtitle : subtitle,
        image : image
    });
    res.send("Blog api hit successfully");
});

app.listen(port, () => {  
    console.log(`App listening at http://localhost:${port}`);
});
