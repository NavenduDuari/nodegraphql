const graphql = require("graphql");
// const _ = require("lodash");
const BookModel = require("../models/book");
const AuthorModel = require("../models/author");



const {GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull} = graphql;


// var books = [
//     {id : "1", name : "book1", genre : "g1", authorId : "1"},
//     {id : "2", name : "book2", genre : "g2", authorId : "2"},
//     {id : "3", name : "book3", genre : "g3", authorId : "3"},
//     {id : "4", name : "book4", genre : "g4", authorId : "1"},
//     {id : "5", name : "book5", genre : "g5", authorId : "2"},
//     {id : "6", name : "book6", genre : "g6", authorId : "3"}
// ];

// var authors = [
//     {id : "1", name : "author1", age : 11},
//     {id : "2", name : "author2", age : 22},
//     {id : "3", name : "author3", age : 33}
// ];



const BookObject = new GraphQLObjectType({
    name : "Book",
    fields : ()=>({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        genre : {type : GraphQLString},
        author : {
            type : AuthorObject,
            resolve(parent, args){
                return(AuthorModel.findById(parent.authorId));
            }
        }
    })
});

const AuthorObject = new GraphQLObjectType({
    name : "Author",
    fields : ()=>({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        age : {type : GraphQLInt},
        books : {
            type : new GraphQLList(BookObject),
            resolve(parent, args){
                return(BookModel.find({authorId : parent.id}));
            }
        }
    })
});

const RootQueryObject = new GraphQLObjectType({
    name : "RootQuery",
    fields : {
       book: {
           type : BookObject,
           args : { id : {type : GraphQLID}},
           resolve(parent, args){
            //    code to get data from db or other sources
                return (BookModel.findById(args.id));
           }
       },
       author : {
           type : AuthorObject,
           args : { id : {type : GraphQLID}},
           resolve(parent, args){
               return(AuthorModel.findById(args.id));
           }
       },
       books : {
           type : new GraphQLList(BookObject),
           resolve(parent, args){
               return(BookModel.find({}));
           }
       },
       authors : {
           type : GraphQLList(AuthorObject),
           resolve(parent, args){
               return(AuthorModel.find({}));
           }
       }
    }
});

const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        addAuthor : {
            type : AuthorObject,
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                age : {type : new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new AuthorModel({
                    name : args.name,
                    age : args.age
                });
                return(author.save());
            }
        },
        addBook :{
            type : BookObject,
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                genre : {type : GraphQLString},
                authorId : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new BookModel({
                    name : args.name,
                    genre : args.genre,
                    authorId : args.authorId
                });
                return (book.save());
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query : RootQueryObject,
    mutation : Mutation
});

