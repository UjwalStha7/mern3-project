const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const commentSchema = new Schema({
    name : {
        type : String
    },
    comment : {
        type : String
    }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;