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



        // gt (greater than)
        const olderThan23 = await collection.find({ age: { $gt: 23 }, _testData: true }).toArray();
        console.log("$gt 23 count:", olderThan23.length);

        // lt (less than)
        const youngerThan25 = await collection.find({ age: { $lt: 25 }, _testData: true }).toArray();
        console.log("$lt 25 count:", youngerThan25.length);

        // regex (name starts with A)
        const startsWithA = await collection.find({ name: { $regex: /^A/i }, _testData: true }).toArray();
        console.log("$regex /^A/i:", startsWithA.map(s => s.name));

        // and (Aarhus AND age < 23)
        const andExample = await collection.find({
            $and: [{ city: "Aarhus" }, { age: { $lt: 23 } }, { _testData: true }]
        }).toArray();
        console.log("$and example:", andExample.map(s => s.name));

        // or (city is Skive OR Aalborg)
        const orExample = await collection.find({
            $or: [{ city: "Skive" }, { city: "Aalborg" }],
            _testData: true
        }).toArray();
        console.log("$or example:", orExample.map(s => `${s.name} (${s.city})`));

        // Projection (only name + major, hide _id)
        const projectionExample = await collection.find(
            { _testData: true },
            { projection: { _id: 0, name: 1, major: 1 } }
        ).toArray();
        console.log("Projection (name, major):", projectionExample);

        // Sort by age DESC + limit 2
        const sortedLimited = await collection.find({ _testData: true })
            .sort({ age: -1 })
            .limit(2)
            .toArray();
        console.log("Sort age desc + limit 2:", sortedLimited.map(s => `${s.name} (${s.age})`));


        // updateOne - change city for John Doe
        const updateOneResult = await collection.updateOne(
            { name: "John Doe", _testData: true },
            { $set: { city: "Copenhagen" } }
        );
        console.log("updateOne modified:", updateOneResult.modifiedCount);

        // updateMany - increment age by 1 for all Computer Science students
        const updateManyResult = await collection.updateMany(
            { major: "Computer Science", _testData: true },
            { $inc: { age: 1 } }
        );
        console.log("updateMany modified:", updateManyResult.modifiedCount);

        // Show updated results
        const updatedStudents = await collection.find({ _testData: true }).toArray();
        console.log("Updated students:", updatedStudents.map(s => `${s.name} (${s.age}, ${s.city})`));


        // Count documents
        const countAll = await collection.countDocuments({ _testData: true });
        console.log("countDocuments (all test data):", countAll);

        // Distinct values (unique cities)
        const uniqueCities = await collection.distinct("city", { _testData: true });
        console.log("distinct cities:", uniqueCities);

        // deleteOne - delete Sofie
        const deleteOneResult = await collection.deleteOne({ name: "Sofie", _testData: true });
        console.log("deleteOne deleted:", deleteOneResult.deletedCount);

        // deleteMany - delete everyone under 23
        const deleteManyResult = await collection.deleteMany({ age: { $lt: 23 }, _testData: true });
        console.log("deleteMany (<23) deleted:", deleteManyResult.deletedCount);

        // Show remaining
        const remaining = await collection.find({ _testData: true }).toArray();
        console.log("Remaining students:", remaining.map(s => `${s.name} (${s.age})`));




    } catch (err) {
        console.error('Error: ', err);
    } finally {
        console.log('Closing connection...');
        await client.close();
    }
}

main();
