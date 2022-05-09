// Tag Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentsSchema = new Schema(
    {   
        text:{type:String, required:true},
        comment_by:{type: Schema.Types.ObjectId, ref:'Users',required:true}
    }
)

 CommentsSchema.virtual('url')
.get(function(){
    return 'posts/comment/' + this._id;
})

module.exports = mongoose.model('Comments', CommentsSchema)