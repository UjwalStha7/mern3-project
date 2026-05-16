require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const connectDB = require('./database/index.js');
const Blog = require('./model/blogModel.js');
const { multer, storage } = require('./middleware/multerConfig.js');
const upload = multer({ storage: storage });
const fs = require('fs'); //built-in package to work with file system
app.use(express.json());
const Comment = require('./model/commentModel.js');
const cors = require('cors');


app.use(cors(
    {
    origin : 'http://localhost:5173' //allow access to frontend running on port 3000
    }
));
 

connectDB();    

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.get('/', (req, res) => {
    res.status(200).json({
        message : "Hello World!"
    });
});

app.post("/upload", async (req, res) => {
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

//upload route to upload file and save data in database
app.post("/blog", upload.single('image'), async (req, res) => {
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
        image : filename //"http://localhost:3000/" + filename"
    });
    console.log(req.body); 
    console.log(req.file);
    res.status(200).json({
        message : "File uploaded successfully",
    }); 
});

//all data retrieval
app.get("/blog", async (req, res) => {
    const blogs = await Blog.find(); //returns array
    res.status(200).json({
        message : "Blogs fetched successfully",
        data : blogs
    });
})

//single data retrieval using id
app.get("/blog/:id", async (req, res) => { 
    //console.log(req.params.id);
    const id = req.params.id;
    const blog = await Blog.findById(id); //returns object and if multiple data then in array.
    if(!blog){
        return res.status(404).json({
            message : "Blog not found"
        });
    }
    res.status(200).json({
        message : "Blog fetched successfully",
        data : blog
    });
});

//delete data using id
app.delete("/blog/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    const imageName = blog.image; //get image name from database to delete the image from storage folder
    fs.unlink(`./storage/${imageName}`, (err) => { //delete image from storage folder
        if(err){
            console.log(err);
        }else{
            console.log("File deleted successfully");
        }   
    });
    await Blog.findByIdAndDelete(id);
    res.status(200).json({
        message : "Blog deleted successfully"
    });
});

//update textual data using id
// app.patch("/upload/:id", async (req, res) => {
//     const id = req.params.id;
//     const { title, subtitle, description} = req.body;
//     await Blog.findByIdAndUpdate(id, {
//         title : title,
//         subtitle : subtitle,
//         description : description
//     });
//     res.status(200).json({
//         message : "Blog updated successfully",
//         data : blog
//     });
// });

//update image data using id
app.patch("/blog/:id", upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const { title, subtitle, description} = req.body;
    let imageName;
    if(req.file){
        imageName = req.file.filename;
        const blog = await Blog.findById(id);
        const oldImageName = blog.image; //get image name from database to delete the image from storage folder
        fs.unlink(`./storage/${oldImageName}`, (err) => { //delete image from storage folder
            if(err){
                console.log(err);
            }else{
                console.log("File deleted successfully");
            }       
        });
    }
    await Blog.findByIdAndUpdate(id, {
        title : title,
        subtitle : subtitle,
        description : description,
        image: imageName
    });
    res.status(200).json({
        message : "Blog updated successfully",
    });
});

app.use(express.static('./storage')); //provide access to storage folder to access images


//Comment api test purpose
app.post("/comment", async (req, res) => {
    const { name, comment} = req.body;
    if(!name || !comment){
        return res.status(400).json({
            message : "Please provide all the required fields"
        });
    }
    await Comment.create({
        name : name,
        comment : comment
    });
    res.status(200).json({
        message : "Comment added successfully"
    });
}); 

//Get api for comment
app.get("/comment", async (req, res) => {
    const comments = await Comment.find();
    res.status(200).json({          
        message : "Comments fetched successfully",
        data : comments
    });
});

app.listen(port, () => {  
    console.log(`App listening at http://localhost:${port}`);
});
