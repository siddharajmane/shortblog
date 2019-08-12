//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");
var data=[{
          "_id":0,
          "posttitle":"",
          "postbody":"",
          "postby":"",
          "postdate":"",
          },
          {
            "_id":0,
            "posttitle":"",
            "postbody":"",
            "postby":"",
            "postdate":"",

}];
let auth="false";
var message;
let status="";

var searchdata=[];

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
mongoose.connect("mongodb+srv://mongoadmin:test123@cluster0-n2oq4.mongodb.net/blogsite");
const postSchema={
  posttitle:String,
  postbody:String,
  postby:String,
  postdate:String,
};

const postmodel=mongoose.model("post",postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  postmodel.find({},function(err,item){
    if(!err){
      res.render("home",{
        homeStartingContent:homeStartingContent,
        postlist:item,
        searchdata:data
      });
    }
  });

});

app.get("/search",function(req,res){
  res.render("search",{
    searchdata:searchdata
  });
});

app.get("/about",function(req,res){
  res.render("about",{
    aboutContent:aboutContent
  });
});

app.get("/compose",function(req,res){
  res.render("compose",{
  });
});

app.get("/login",function(req,res){
  if(auth=="false"){
  res.render("login",{
    message:message
  });
}
else{
  res.redirect("/admin");
}
});

app.post("/authentication",function(req,res){
  let user=req.body.username;
  let password=req.body.password;
  if(user==="admin@shortblog.com"&&password==="123456")
  {
    auth="true";
    res.redirect("/admin");
  }
  else{
    message="user or password invalid";
    res.redirect("/login");
  }
});

app.get("/admin",function(req,res){
  if(auth=="true"){
    res.render("admin",{
      resultdata:status
    });
  }
  else{
    res.redirect("/login");
  }
});


app.get("/posts/:postid",function(req,res){
  let routpos=_.lowerCase(req.params.postid);
  postmodel.find({},function(err,postlist){
    if(!err){
      postlist.forEach(function(item){
    if(_.lowerCase(item.posttitle)===routpos)
    {
      res.render("post",{
        post:item,
      });
    }
  });
    }
  });

});

app.post("/delete",function(req,res){
  let resultdata=req.body.deleteblog;
  postmodel.findOneAndRemove({"posttitle":resultdata},function(err){
    if(!err)
    {
      res.render("admin",{
        resultdata:"success"
      });
    }
    else {
      res.render("admin",{
        resultdata:"error"
      });
    }
  });
});


app.post("/compose",function(req,res){
    let title=req.body.posttitle;
    let post=req.body.postbody;
    let d=new Date();
    let date=d.toDateString("en-US");
    let postby=req.body.postby;
  let postobject=new postmodel({
    posttitle:title,
    postbody:post,
    postby:postby,
    postdate:date,

  });
  postobject.save();
  res.redirect("/");

});


app.post("/search1",function(req,res){
  let resultdata=req.body.searchbar;
  postmodel.find({$text: {$search: resultdata}}, {score: {$meta: "textScore"}},function(err,docs){
    searchdata=docs;
    console.log(resultdata);
    console.log(docs);
    res.redirect("/search");
  });
});

app.get("/logout",function(req,res){
  auth="false";
  res.redirect("/");
});

app.get("/sample",function(req,res){
  res.render("sample");
});

let port=process.env.PORT;
if(port==null || port==""){
  port=3000;
}

app.listen(port,function(){
  console.log("server");
});
