const { graphql } = require('graphql');
const readline = require('readline');
const mySchema = require('./schema/main');
const rli = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const {MongoClient} = require('mongodb');
const assert = require('assert');
const MONGO_URL = 'mongodb://localhost:27017';
const graphqlHTTP = require('express-graphql');
const express = require('express');
const app = express();

MongoClient.connect(MONGO_URL, (err, client)=>{
    assert.equal(null,err);
    var db = client.db('test');
    console.log('connected to mongodb server');
    rli.question('Client Request: ', inputQuery => {
        graphql(mySchema, inputQuery,{},{db}).then(result => {
            console.log('Server Answer :', result.data);
            client.close(() => rli.close());
        });
    });
    app.use('/graphql', graphqlHTTP({
        schema: mySchema,
        context: { db },
        graphiql: true
    }));
    app.listen(3000, () => console.log('Running Express.js on port 3000'));
});




