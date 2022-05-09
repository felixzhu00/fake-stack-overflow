// User Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsersSchema = new Schema(
    {   
        username:{type: String, required: true},
        email:{type: String, required: true},
        password:{type: String, required: true},
        reputation: {type: Number, default: 0},
        register_date:{type: Date, default: Date.now}
    }
)

UsersSchema.virtual('url')
.get(function(){
    return 'posts/user/' + this._id;
})

module.exports = mongoose.model('Users', UsersSchema)