const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const url = process.env.URI;
const dbName = 'SalamHack'; 

let dbClient;

async function connectClient() {
    if (dbClient) {
        console.log('Using existing db client connection');
        return db;
    }
    try {
        const client = new MongoClient(url);
        await client.connect();
        dbClient = client.db(dbName);
        console.log('mongoClient connected');
        return dbClient;
    } catch (error) {
        console.error('Error connecting to db client:', error);
        throw error;
    }
}

async function connectMongoose() {
    try {
        await mongoose.connect(url,{dbName: dbName});
        console.log('mongoose connected');
    } catch (error) {
        console.error('Error connecting to db mongoose:', error);
        throw error;
    }
}


module.exports = {connectMongoose, connectClient};