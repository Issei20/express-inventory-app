var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MemKeyboardSchema = new Schema (
    {
        name: {type: String, required: true, maxLength: 100},
        description: {type: String, maxLength: 1000},
        price: {type: mongoose.Decimal128, required: true},
        number_in_stock: {type: Number, required: true},
        brand: {type: String, required: true},
        layout: {type: String, required: true, enum: ['QWERTY', 'AZERTY']},
        images: {type: String},
    }
);

//Virtual for mecakeyboard's URL
MemKeyboardSchema
.virtual('url')
.get(function () {
    return '/inventory/memkeyboard/' + this._id;
});

//Export model
module.exports = mongoose.model('MemKeyboard', MemKeyboardSchema);