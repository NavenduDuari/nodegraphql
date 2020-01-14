const graphql = require("graphql");
// const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");



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



const BookType = new GraphQLObjectType({
    name : "Book",
    fields : ()=>({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        genre : {type : GraphQLString},
        author : {
            type : AuthorType,
            resolve(parent, args){
                return(Author.findById(parent.authorId));
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name : "Author",
    fields : ()=>({
        id : {type : GraphQLID},
        name : {type : GraphQLString},
        age : {type : GraphQLInt},
        books : {
            type : new GraphQLList(BookType),
            resolve(parent, args){
                return(Book.find({authorId : parent.id}));
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name : "RootQuery",
    fields : {
       book: {
           type : BookType,
           args : { id : {type : GraphQLID}},
           resolve(parent, args){
            //    code to get data from db or other sources
                return (Book.findById(args.id));
           }
       },
       author : {
           type : AuthorType,
           args : { id : {type : GraphQLID}},
           resolve(parent, args){
               return(Author.findById(args.id));
           }
       },
       books : {
           type : new GraphQLList(BookType),
           resolve(parent, args){
               return(Book.find({}));
           }
       },
       authors : {
           type : GraphQLList(AuthorType),
           resolve(parent, args){
               return(Author.find({}));
           }
       }
    }
});

const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        addAuthor : {
            type : AuthorType,
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                age : {type : new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name : args.name,
                    age : args.age
                });
                return(author.save());
            }
        },
        addBook :{
            type : BookType,
            args : {
                name : {type : new GraphQLNonNull(GraphQLString)},
                genre : {type : GraphQLString},
                authorId : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
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
    query : RootQueryType,
    mutation : Mutation
});

