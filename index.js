const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require("body-parser");

const ObjectID = require("mongodb").ObjectID;
require('dotenv').config()



const app = express()
const port = 5000



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.4p4eq.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const reviewCollection = client.db("BlogStore").collection("review");
    const adminCollection = client.db("BlogStore").collection("admin");
    const blogsCollection = client.db("BlogStore").collection("blog");
    // perform actions on the collection object
    //review post
    app.post("/addReview", (req, res) => {
        const review = req.body;
        // console.log(review);
        reviewCollection.insertOne(review).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    //review get
    app.get("/reviews", (req, res) => {
        reviewCollection.find({})
            .toArray((err, docs) => {
                res.send(docs);
                // console.log(docs)
            });
    });

    //delete product
    app.delete("/deleteEvent/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        console.log("delete", id);
        serviceCollection.findOneAndDelete({ _id: id })
            .then(docs => {
                res.send(!!docs.value[0])
            });
    });


    //Make admin
    app.post("/makeAdmin", (req, res) => {
        const admin = req.body;
        // console.log("admin",admin);
        adminCollection.insertOne(admin).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.post("/isAdmin", (req, res) => {
        const admin = req.body;
        // console.log(date.date);
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0)
            });
    });

    //blogs add
    app.post("/addBlog", (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const title = req.body.title;
        const category = req.body.category;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString("base64");

        let image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, "base64"),
        };

        blogsCollection.insertOne({ name, category, title, description, image }).then((result) => {
            res.send(result.insertedCount > 0);
        });
    })

    //get blogs
    app.get("/blogs", (req, res) => {
        blogsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                // console.log(err,documents)
            });
    });
});


app.listen(port)
