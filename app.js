require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const connectDB = require('./database/index.js');
const Blog = require('./model/blogModel.js');
const { multer, storage } = require('./middleware/multerConfig.js');
const upload = multer({ storage: storage });
app.use(express.json());

connectDB();    

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.get('/', (req, res) => {
    res.status(200).json({
        message : "Hello World!"
    });
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

// app.post("/upload", upload.single('image'), (req, res) => {
//     res.status(200).json({
//         message : "File uploaded successfully",
//     });
// });

app.post("/upload", upload.single('image'), async (req, res) => {
    const { title, subtitle, description} = req.body;
    const filename = req.file.filename;
    // const {filename} = req.body;   destructuring
    if(!title || !subtitle || !description){
        return res.status(400).json({
            message : "Please provide all the required fields"
        });
    }
    await Blog.create({
        title : title,  //if name of key and value is same we can just write title
        subtitle : subtitle,
        description : description,
        image : filename
    });
    console.log(req.body); 
    console.log(req.file);
    res.status(200).json({
        message : "File uploaded successfully",
    }); b
});

app.get("/upload", async (req, res) => {
    const blogs = await Blog.find(); //returns array
    res.status(200).json({
        message : "Blogs fetched successfully",
        data : blogs
    });
})

app.use(express.static('./storage'));

app.listen(port, () => {  
    console.log(`App listening at http://localhost:${port}`);
});
