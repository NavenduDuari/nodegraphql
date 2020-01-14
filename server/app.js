const express = require("express");

const graphqlHTTP = require("express-graphql"); //middleware

const schema = require("./schema/schema");

const mongoose = require("mongoose");

const app = express();


// connect to the db
mongoose.connect(
    "mongodb://test:test123@ds361968.mlab.com:61968/nodegrapgql",
    { useUnifiedTopology: true , useNewUrlParser: true})
    .catch(err=>console.log(err));
mongoose.connection.once("open", ()=>{
    console.log("connected to mlab");
});

app.use("/graphql", graphqlHTTP({
    schema ,
    graphiql : true
}));

app.listen(8000, ()=>{
    console.log("listening to port 8000")
});