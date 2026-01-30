// W3schools MongoDB tutorial
// https://www.w3schools.com/mongodb/index.php

// Install Docker Desktop:
// winget install Docker.DockerDesktop

// Install Node.js:
// npm init -y
// npm install mongodb

// Run Docker Desktop:
// docker run --name mongodb -d -p 27017:27017 mongo:latest

// Run Node.js example:
// node stub.js

// W3schools MongoDB tutorial
// https://www.w3schools.com/mongodb/index.php

const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);

const dbName = 'school';
const collectionName = 'students';

async function main() {
    // Connect to db
    try {
        await client.connect();
        console.log('Connected successfully to server');
    } catch (err) {
        console.error('CRITICAL: Could not connect to database.', err);
        return;
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // DeleteMany Clean old test data (så output bliver ens hver gang)
        const deleteResult = await collection.deleteMany({ _testData: true });
        console.log('Deleted old test documents:', deleteResult.deletedCount);

        // Insert one
        const insertOneResult = await collection.insertOne({
            name: "John Doe",
            age: 25,
            major: "Computer Science",
            city: "Aarhus",
            _testData: true
        });
        console.log('Inserted ONE document:', insertOneResult.insertedId);

        // Insert many
        const insertManyResult = await collection.insertMany([
            { name: "Anna", age: 22, major: "Business", city: "Skive", _testData: true },
            { name: "Omar", age: 28, major: "Computer Science", city: "Aalborg", _testData: true },
            { name: "Sofie", age: 19, major: "Design", city: "Aarhus", _testData: true },
        ]);
        console.log('Inserted MANY documents:', insertManyResult.insertedCount);

        // Find ONE (findOne)
        const oneStudent = await collection.findOne({ name: "John Doe", _testData: true });
        console.log("findOne result:", oneStudent);

        // Find MANY (find + toArray)
        const allTestStudents = await collection.find({ _testData: true }).toArray();
        console.log("find (all test students) count:", allTestStudents.length);

        // Find MANY with filter (example)
        const csStudents = await collection.find({ major: "Computer Science", _testData: true }).toArray();
        console.log("find (Computer Science) count:", csStudents.length);

    } catch (err) {
        console.error('Error: ', err);
    } finally {
        console.log('Closing connection...');
        await client.close();
    }
}

main();
