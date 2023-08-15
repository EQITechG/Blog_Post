//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const app = express();
const https = require("https");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const year = new Date().getFullYear();
const copyRight = "Copy Right © " +year;

mongoose.connect("mongodb+srv://dudish:Test123@cluster0.8oomc4i.mongodb.net/blogDB");
const postSchema = new mongoose.Schema({ 
  title: {
    type: String
  },
  content: {
    type: String
  }
});
const Posts = mongoose.model("Posts", postSchema); 


app.get("/",(req,res)=>{

  async function displayPosts(){
    const foundItems = await Posts.find({}); //find exisiting items in database  
    res.render("home", {
      homeContent:homeStartingContent, 
      copyRightKey:copyRight, 
      posts:foundItems
    });
}
displayPosts();//since it's all a function, call the function
});

app.get("/about", (req,res)=>{
  res.render("about", {aboutContent:aboutContent, copyRightKey:copyRight})

});
app.get("/contact", (req,res)=>{
  res.render("contact", {contactContent:contactContent, copyRightKey:copyRight})

});
app.get("/compose", (req,res)=>{
res.render("compose", {copyRightKey:copyRight})

});


app.post("/", (req,res)=>{
  const titlePost = req.body.postTitle;
  const bodyPost = req.body.postBody;
 
  const addPost = new Posts ({
    title: titlePost,
    content: bodyPost
  })
  addPost.save();
  res.redirect("/");

});

app.get("/posts/:title", async (req, res) => {
const requestedTitle = req.params.title;
const foundList = await Posts.findOne({_id: requestedTitle});
res.render("post", {
  title:foundList.title,
  content:foundList.content,
  copyRightKey:copyRight
})

});



app.get("/delete", (req, res) => {
  
async function displayPosts(){
    const foundItems = await Posts.find({}); //find exisiting items in database  
 
    res.render("delete", {
      copyRightKey:copyRight, 
      posts:foundItems
    });
}
displayPosts();//since it's all a function, call the function

  });

app.post("/delete", async (req,res)=>{
  const toDelete = req.body.deleteTitle
  await Posts.findOneAndDelete(toDelete);
    res.redirect("/delete");
  
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,()=>{
console.log("Server Running on Port 3000")
});
