var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SwitchKeySchema = new Schema (
    {
        name: {type: String, required: true, maxLength: 100},
        description: {type: String, required: true, maxLength: 1500},
        price: {type: mongoose.Decimal128, required: true},
        number_in_stock: {type: Number, required: true},
        type: {type: String, required: true},
        images: {type: String},
    }
);

//Virtual for mecakeyboard's URL
SwitchKeySchema
.virtual('url')
.get(function () {
    return '/inventory/switchKey/' + this._id;
});

//Export model
module.exports = mongoose.model('SwitchKey', SwitchKeySchema);