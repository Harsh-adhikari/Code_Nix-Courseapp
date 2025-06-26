import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    union: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("User", courseSchema); // We are converting the schema into a model and storing this model as a name of course and exprting it so that we can use it in other files.