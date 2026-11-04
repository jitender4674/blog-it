require('dotenv').config();
const express = require("express");
const path = require("path")
const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_DB_URL).then(e => console.log("mongoDB connected")).catch(err => console.log(err));


// middleware
// for properly parsing form data
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./public")))


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

// 
app.get("/", async(req,res) =>{
    // console.log(req.user)
    if(req.user){
        const allBlogs = await Blog.find({createdBy: req.user._id});
        res.render("homepage",{
        user: req.user,
        blogs: allBlogs,
    });
    }else{
        res.render("homepage");
    }
    // console.log(allBlogs);

    
})
// routes
app.use("/user", userRoute);
app.use('/blog', blogRoute);


app.listen(PORT, () => console.log("server started at port: 8000"));
