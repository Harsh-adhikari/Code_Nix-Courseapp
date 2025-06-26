import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: true,
  },
  image: {
    public_id:{
      type: String,
      required: true
    },
    url:{
      type: String,
      required: true
    }
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  }
});

export const Course = mongoose.model("Course", courseSchema); // We are converting the schema into a model and storing this model as a name of course and exprting it so that we can use it in other files.