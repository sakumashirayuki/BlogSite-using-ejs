//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');
const ejs = require("ejs");
const path = require("path");
var _ = require("lodash");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Used to parse JSON bodies
app.use(express.static("public"));

// connect to mongoose
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
// blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Blog = mongoose.model('blog',blogSchema);

// home route
app.get("/", (req, res) => {
  Blog.find({},(err, docs)=>{
    if(err){
      console.log(err);
    }else{
      // docs.forEach(doc=>{
      //   posts.push({
      //     title: doc.title,
      //     body: doc.content
      //   });
      //   postHrefs.push('/posts/' +  _.kebabCase(req.body.newBlogTitle));
      // });
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: docs
        // postHrefs: postHrefs
      });
    }
  });
});

// /about route
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

// /contact route
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

// /compose route
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const newBlog = new Blog({
    title: req.body.newBlogTitle,
    content: req.body.newBlogContent
  });
  newBlog.save().then(()=>{
    res.redirect("/");
  });
});

// post route
app.get("/posts/:postId", (req, res) => {
  // const isMatch = posts.find(
  //   ({ title }) => _.lowerCase(title) === _.lowerCase(req.params.postId)
  // );
  Blog.findOne({_id: req.params.postId}, (err, doc)=>{
    if(err){
      console.log("Cannot find this post!");
    }else{
      res.render("post", {
        homeStartingContent: "",
        posts: [doc]
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
