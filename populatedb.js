#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var MecaKeyboard = require('./models/mecakeyboard')
var MemKeyboard = require('./models/memkeyboard')
var SwitchKey = require('./models/switchKey')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var mecakeyboards = []
var memkeyboards = []
var switches = []


function mecakeyboardCreate(name, description, price, number_in_stock, brand, layout, images, cb) {
  mecakeyboarddetail = {
    name:name, 
    description: description, 
    price:price,
    number_in_stock: number_in_stock, 
    brand: brand,
    layout: layout,
    images: images,
  }

  
  var mecakeyboard = new MecaKeyboard(mecakeyboarddetail);
       
  mecakeyboard.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New mecakeyboard: ' + mecakeyboard);
    mecakeyboards.push(mecakeyboard)
    cb(null, mecakeyboard)
  }  );
}

function memkeyboardCreate(name, description, price, number_in_stock, brand, layout, images, cb) {
  memkeyboarddetail = {
    name:name, 
    description: description, 
    price: price, 
    number_in_stock: number_in_stock, 
    brand: brand,
    layout: layout, 
    images: images,
  }

  var memkeyboard = new MemKeyboard(memkeyboarddetail);
       
  memkeyboard.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New memkeyboard: ' + memkeyboard);
    memkeyboards.push(memkeyboard)
    cb(null, memkeyboard)
  }  );
}

function switchKeyCreate(name, description, price, number_in_stock, type, images, cb) {
  switchkeydetail = { 
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
    type: type,
    images: images,
  }
    
  var switchKey = new SwitchKey(switchkeydetail);    
  switchKey.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New switch: ' + switchKey);
    switches.push(switchKey)
    cb(null, switchKey)
  }  );
}



function createMecaKeyboard(cb) {
    async.series([
        function(callback) {
          mecakeyboardCreate('VA88M Sakura', 'Pink, not a color you see on many keyboards, Varmilo has now released a special Sakura Edition with a decorated SpaceBar and a pink case. It is there to reflect one of the most important Japanese Culture Symbols, the Sakura Tree. The keyboard is not limited but is very hard to get, we are very proud to present this keyboard to our customers. The Sakura Edition keyboard still keeps the high-quality legacy of the VA88M which has been a very successful keyboard for Varmilo. The keyboard comes with a pink ABS case and very high-quality PBT keycaps. It also features LEDs which can be turned off. The case has a sleek low profile and the 2x3x4mm LEDs also add to the quality touch of the keyboard. This keyboard also works with MAC OS X.',
           155, 10, 'Varmilo', 'QWERTY','', callback);
        },
        function(callback) {
          mecakeyboardCreate('VA87M Black', 'The Varmilo VA88M is the larger model keyboard that Varmilo provides out of their range. The VA88M features a very strong plastic ABS case and Cherry MX Switches that can last up to 50 million actuations. Varmilo has put value on quality and design, as seen by the slim case and the high-quality PBT keycaps. The case sits lower than the keycaps, giving it a slim look. This keyboard includes all required function keys, but no num-pad keys. The PBT Dye Sub keycaps are a joy to use and will provide any typist a perfect feel of typing. LEDs are included on this keyboard, giving the keyboard a cool look in dark light.',
           155, 8, 'Varmilo', 'QWERTY', '', callback);
        },
        function(callback) {
          mecakeyboardCreate('Leopold FC750PD (Black)', 'The Leopold FC750 gets a fresh update with Double-Shot PBT Keycaps and some color! The FC750PD is made from the same high-quality ABS housing as the FC750R and it also comes with high-quality German-made MX Switches. The Tenkeyless keyboard has a very sleek profile and looks great on any desk, it also is quiet thanks to its sound-dampening pad inside the keyboard that dampens the hard pushes of the key-switches. Thanks to Double-Shot keycaps, the keycaps now feature colors and a better feel to the fingers when typing.',
           127, 2, 'Leopold', 'QWERTY', '', callback);
        },
        function(callback) {
          mecakeyboardCreate('Cherry MX 10.0N RGB', '',
           145, 5, 'Cherry', 'AZERTY', '', callback);
        },
        function(callback) {
          mecakeyboardCreate('Logitech G213 Prodigy', 'Logitech G213 Prodigy, Gaming Keyboard, LIGHTSYNC RGB Lighting, Spill Resistant, Customizable, Dedicated Multimedia Controls, French AZERTY Keyboard - Black',
           50, 3, 'Logitech', 'AZERTY', '',callback);
        },
        ],
        // optional callback
        cb);
}


function createMemKeyboard(cb) {
    async.parallel([
      function(callback) {
        memkeyboardCreate('Rainbow Backlit', '104 Key wired keyboard is with 7 colors rainbow effect, and the backlight can switch between 7 color light rainbow mode, breathing mode and turn off. Fantastic backlit provides a cool gaming atmosphere.',
         35, 3, 'Havit', 'QWERTY', '', callback);
      },
      function(callback) {
        memkeyboardCreate('Lioncast LK100', 'Lioncast LK100 RGB Membrane Gaming Keyboard for PC/Laptop/PS4/Xbox One 19 Key Anti-Ghosting RGB Gaming Keyboard with 16.8 Million Colors, LED, USB, QWERTZ, Wrist Rest',
         45, 7, 'Lioncast', 'QWERTY','', callback);
      },
      function(callback) {
        memkeyboardCreate('Razer Cynosa V2', 'Razer Cynosa V2 Chroma RGB Membrane Gaming Keyboard Nordic',
         50, 1, 'Razer', 'QWERTY','',callback);
      },
        ],
        // optional callback
        cb);
}


function createSwitchKey(cb) {
    async.parallel([
      function(callback) {
          switchKeyCreate('Cherry MX Red', 'The Cherry MX Red is a linear switch with an audible bottom-out. Operating Force / 45 cN / Durability / More than 50 million actuations / Red switch: Lighter, smooth linear switch',
         0.50, 100, 'Red','', callback);
      },
      function(callback) {
          switchKeyCreate('Kailh Speed Silver', 'The Kailh Speed switches are new switches introduced by Kaihua aimed at Gamers. The speed series switches have very rapid actuation and use much less force to press than standard switches. They are truly in the league of their own. The switch is for plate-mount keyboards but can also be used on PCB keyboards but they will not be as stable. The switches also feature a translucent top to let LED 3mm or 2x3x4mm bulbs to illuminate the whole switch without any shadowing. The quality of the switches have greatly been improved, you may also be familiar with Kailh switches from Razer Keyboard products.',
         0.60, 50, 'Silver','', callback);
      },
      function(callback) {
          switchKeyCreate('Cherry MX Blue', 'The Cherry MX Blue is a clicky switch with an audible click on actuation.',
         0.50, 160, 'blue','', callback);
      },
        ],
        // Optional callback
        cb);
}



async.series([
    createMecaKeyboard,
    createMemKeyboard,
    createSwitchKey
],

// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+switches);
        
    } 
    // All done, disconnect from database
    mongoose.connection.close();
});



