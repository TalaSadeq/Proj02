const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcrypt");
const { object } = require('joi');

const mongoConnection = process.env.MONGODB_CONNECTION;


async function searchStudent(partOfStudentName) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const oneUser = await db.collection("users")
                        .find({ fullName: { $regex: new RegExp(partOfStudentName, "i") } , role: 'student' })
                        .project({ fullName: 1 })
                        .toArray();
    client.close();
    return oneUser;
}


async function storeCourseDegree(createFormData) {
    studentId = createFormData.studentId;
    let studentCourses = {};
    studentCourses.courseId = createFormData.courseId;
    studentCourses.courseName = createFormData.courseName;
    studentCourses.degree = createFormData.degree;
    studentCourses.courseDate = createFormData.courseDate;

    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("users")
                        .updateOne( { _id: new ObjectId(String(studentId)) } ,
                                    { $push: { studentCourses: studentCourses } },
                                    function(err, res){
                                            if(err) throw err;
                                            client.close();
                                            return {"operation": "success"};
                                        });
}


async function showCourses(studentId) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const oneUser = await db.collection("users").find( { _id: new ObjectId(String(studentId)) } ).toArray();
    client.close();
    return oneUser;
}


async function deleteResult(userId, courseId) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    try {
        // Find the user document with the specified userId
        const user = await db.collection("users").findOne({ _id: new ObjectId(String(userId)) });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Find the course object with the specified courseId
        const courseIndex = user.studentCourses.findIndex(course => course.courseId === courseId);

        if (courseIndex === -1) {
            throw new Error('Course not found for the user');
        }

        // Unset the degree field for the specified course
        await db.collection("users").updateOne(
            { _id: new ObjectId(String(userId)), "studentCourses.courseId": courseId },
            { $unset: { "studentCourses.$.degree": "" } }
        );

        return { operation: 'done' };
    } catch (error) {
        console.error('Error deleting result:', error);
        throw error;
    } finally {
        client.close();
    }
}



module.exports = {
    searchStudent,
    storeCourseDegree,
    showCourses,
    deleteResult
}