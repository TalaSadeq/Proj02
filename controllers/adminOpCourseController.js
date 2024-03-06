const adminOpCourseModel = require("../models/adminOpCourseModel");
const Joi = require('joi');

const store = (req, res) => {
    ///
    const schema = Joi.object({
        courseName: Joi
            .string()
            .min(5)
            .required(),
        courseCategory: Joi
            .string()
            .min(3)
            .required(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const formattedErrors = error.details.map((detail) => ({
            field: detail.context.label,
            message: detail.message,
        }));
        return res.status(400).json({ errors: formattedErrors });
    }

    //////////
    adminOpCourseModel.checkCourseNameDuplication(req.body.courseName)
        .then(oneCourse => {
            if (oneCourse.length != 0) {
                return res.status(400).json({ errors: 'course name reserved .' });
            }
            else {
                adminOpCourseModel.store(req.body)
                    .then(error => {
                        if(error){
                            return res.status(500).json({ errors: 'server error .' });
                        }
                        else{
                            return res.status(200).json({ storeNewCourse: 'done' });
                        }                        
                    });                
            }
        });
    //

}

const deleteCourse =(req, res) => {
    try {
        const courseId = req.params.courseId
        adminOpCourseModel.deleteCourse(courseId);
        res.status(200).send("Course deleted successfully");
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).send("Error deleting course");
    }
};

const UpdateCourse =(req, res) => {
    try {
        const courseId = req.params.courseId ;
        const createFormData = req.body ;
        adminOpCourseModel.UpdateCourse(courseId,createFormData);
        res.status(200).send("Course Updated successfully");
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).send("Error deleting course");
    }
};

module.exports = {
    store,
    deleteCourse,
    UpdateCourse
}