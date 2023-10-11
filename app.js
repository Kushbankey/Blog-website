//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import mongoose from "mongoose";

const homeStartingContent = 
`Hello and welcome to DAILY JOURNAL, your daily destination for informative and engaging content that covers a wide range of topics. 
Whether you're looking for the latest news, helpful tips, inspiring stories, or just a good read to brighten your day, you've come to the right place. 
At DAILY JOURNAL, we believe in the power of knowledge and storytelling. Our team of passionate writers is committed to bringing you fresh and diverse content every day of the week. 
From travel and technology to health, lifestyle, and beyond, our goal is to inform, entertain, and inspire our readers.`;

const aboutContent =
`Hello, I'm Kushagra Bankey, a passionate and creative WEB Developer based in India. With a strong background in FrontEnd, 
I'm dedicated to delivering high-quality work and making a positive impact. My goal is to serve the users with more than what they deserve.
I'm constantly seeking opportunities to expand my skills and knowledge.`;

const contactContent = `
Let's Collaborate!
If you're looking for someone to build your impactful website, please don't hesitate to get in touch.
You can check out my Portfolio to see some of my past work and get a better sense of what I can bring to your next project.`;

const app = express();
const port=process.env.PORT|3000;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
import {} from 'dotenv/config';

import { connectDB } from './DB/mongo.js';
connectDB();

const postSchema= {
  title: String,
  content: String
};

const Post=mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  async function findAllPosts(){
    try{
      const result= await Post.find();

      res.render("home", {
        startingContent: homeStartingContent,
        posts: result
      });
    }
    catch(error){
      console.log(error);
    }
  }
  findAllPosts();
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  async function checkForDuplicates(){
    try{
      const existingPost=await Post.findOne({title: req.body.postTitle});

      if(existingPost){
        const msg="A post with the same title already exists!";
        //console.log(msg);
        res.render("compose", {message: msg});
      }
      else{
        const post = new Post({
          title: req.body.postTitle,
          content: req.body.postBody
        });
      
        post.save();
      
        res.redirect("/");
      }
    }
    catch(error){
      console.log(error);
    }
  }
  checkForDuplicates();
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  //console.log("Id: " + requestedPostId);

  async function findPost(){
    try{
      const result= await Post.findOne({_id: requestedPostId});

      //console.log(`Found a post titled: ${result.title}.`);
      res.render("post", {
        id: result._id,
        title: result.title,
        content: result.content
      });
    }
    catch(error){
      console.log(error);
    }
  }
  findPost();
});

app.get("/posts/:postId/edit", function(req,res){
  async function findPost(){
    try{
      const requestedPostId=req.params.postId;
      const post=await Post.findOne({_id: requestedPostId});

      res.render(`edit`, {
        postId: post._id,
        postTitle: post.title,
        postContent: post.content
      });
    }
    catch(error){
      console.log(error);
    }
  }
  findPost();
});

app.post("/posts/:postId/edit", function(req,res){
  async function editPost(){
    try{
      const postId = req.params.postId;
      const postTitle= req.body.postTitle;
      const updatedContent = req.body.postBody;
      //console.log(updatedContent);

      // Update the post's content in the database
      const result = await Post.findByIdAndUpdate(postId, { content: updatedContent }, { new: true });

      if (!result) {
        // If the post with the specified ID is not found
        return res.status(404).json({ message: 'Post not found' });
      }
      //console.log(`Updated posts with title: ${postTitle}.`);

      // Redirect the user to the post's details page after the update
      res.redirect(`/posts/${postId}`);
    }
    catch(error){
      console.log(error);
    }
  }
  editPost();
});

app.post("/posts/delete", function(req,res){
  async function deletePost(){
    try{
      const id=req.body.deleteBtn;
      //console.log(id);
      const result= await Post.deleteOne({_id: id});
      //console.log(`1 post deleted.`);

      res.redirect("/");
    }
    catch(error){
      console.log(error);
    }
  }

  deletePost();
});

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});