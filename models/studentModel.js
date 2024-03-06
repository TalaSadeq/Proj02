const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcrypt");

const mongoConnection = process.env.MONGODB_CONNECTION;


async function showCourses(studentId) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const oneUser = await db.collection("users").find( { _id: new ObjectId(String(studentId)) } ).toArray();
    client.close();
    return oneUser;
}

async function Updatepassword(signupFormData) {
    let doc = {};
    bcrypt.hash(signupFormData.password, 11, async (err, hash) => {
        if (err) {
            //
        }
        else {
            // hash            
            doc.userName = userName;
            doc.password = hash;

            const client = await MongoClient.connect(mongoConnection);
            const db = client.db();
            await db.collection("users").updateOne(
                { $set: { password: doc.password} }
            );
            client.close();
            return { "operation": "success" };
        }
    });
}
module.exports = {
    showCourses,
    Updatepassword
}