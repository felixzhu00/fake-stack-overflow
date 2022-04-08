// Question Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionsSchema = new Schema(
    {   
        title:{type: String, required: true, maxLength: 100},
        text: {type: String, required: true},
        tags: [{type: Schema.Types.ObjectId, ref:'Tags', require: true}],
        answers: [{type: Schema.Types.ObjectId, ref:'Answers'}],
        asked_by: {type: String, default:'Anonymous'},
        ask_date_time: {type: Date, default: Date.now},
        views:{type: Number, default: 0}
    }
)

QuestionsSchema.virtual('url')
.get(function(){
    return 'posts/question/' + this._id;
})

module.exports = mongoose.model('Questions', QuestionsSchema)