const express=require("express")
// below import for auth routes
const auth = require('./routes/auth')
const post = require('./routes/post')
const app=express();


app.use(express.json())
// using authentication route
app.use('/auth',auth);
app.use('/post',post);

app.get("/",(req,res)=>{
    res.send("Hey Bro I am index.js")
})


app.listen(5000,()=>{
    console.log('Hello I am listening')
})