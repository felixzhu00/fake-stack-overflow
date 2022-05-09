// Tag Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TagsSchema = new Schema(
    {   
        name:{type:String, required:true},
        tag_by:{type: Schema.Types.ObjectId, ref:'Users', required:true}
    }
)

TagsSchema.virtual('url')
.get(function(){
    return 'posts/tag/' + this._id;
})

module.exports = mongoose.model('Tags', TagsSchema)