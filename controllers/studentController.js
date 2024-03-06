const studentModel = require("../models/studentModel");

const jwt = require('jsonwebtoken');
const Joi = require('joi');

const showCourses = (req, res) => {

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const secretKey = process.env.JWT_SECRET_KEY;
        var decodedToken = jwt.verify(token, secretKey);
        var studentId = decodedToken.userId;
    } catch (error) {
        return res.status(401).json({ login: 'failed, no user name OR password valid jwt', err: error });
    }
    
    studentModel.showCourses(studentId)
        .then(oneStudent => {
            if (!oneStudent[0].hasOwnProperty('studentCourses')) {
                return res.status(201).json({ search: 'no courses for this student' });
            }
            else {
                if (oneStudent[0].studentCourses.length == 0) {
                    return res.status(201).json({ search: 'no courses for this student' });
                }
                else {
                    return res.status(200).json({ search: 'student courses valid', courses: oneStudent[0].studentCourses });
                }

            }
        });
}


const UpdatePassword = (req, res) => {
    const schema = Joi.object({
         password: Joi
            .string()
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        confirmPassword: Joi
            .ref('password'),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const formattedErrors = error.details.map((detail) => ({
            field: detail.context.label,
            message: detail.message,
        }));
        return res.status(409).json({ errors: formattedErrors });
    }
   
    
  try {
       
        const createFormData = req.body ;
        studentModel.Updatepassword(createFormData)
        res.status(200).send("Password Updated successfully");
    } catch (error) {
        console.error("Error Updating Password:", error);
        res.status(500).send("Error Updating password");
    }
}
module.exports = {
    showCourses,
    UpdatePassword
}