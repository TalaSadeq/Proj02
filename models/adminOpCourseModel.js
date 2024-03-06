const { string } = require('joi');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const mongoConnection = process.env.MONGODB_CONNECTION;


async function checkCourseNameDuplication(courseName) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const oneCourse = await db.collection("courses").find({ courseName: courseName }).toArray();
    client.close();
    return oneCourse;
}
async function deleteCourse(courseId) {
 
        const client = await MongoClient.connect(mongoConnection);
        const db = client.db();
        await db.collection("courses").deleteOne({ _id: new ObjectId(String(courseId)) }),function(err,result){
            if(err){
                throw err;
            }
            console.log("Course deleted successfully");
            client.close();
            return {"operation" : "done"}; 
        }
        
        
    }

    async function UpdateCourse(courseId,createFormData) {
    
        const client = await MongoClient.connect(mongoConnection);
        const db = client.db();
        await db.collection("courses").updateOne(
            { _id: new ObjectId(String(courseId)) },
            { $set: { courseName: createFormData.courseName, courseCategory: createFormData.courseCategory } }
        );
            console.log("Course Updated successfully");
            client.close();
            return {"operation" : "done"}; 
        
    }

async function store(createFormData) {
    let doc = {};
    doc.courseName = createFormData.courseName;
    doc.courseCategory = createFormData.courseCategory;

    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("courses").insertOne(doc, function(err, res){
        if(err) throw err;
        client.close();
        return {"operation": "success"};
    });
}


module.exports = {
    checkCourseNameDuplication,
    store,
    deleteCourse,
    UpdateCourse
}