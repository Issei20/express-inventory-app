var MecaKeyboard = require('../models/mecakeyboard');
var MemKeyboard = require('../models/memkeyboard')
var SwitchKey = require('../models/switchKey')
var async = require('async');
const { body,validationResult } = require("express-validator");


exports.index = function(req, res) {

    async.parallel({
        mecakeyboard_count: function(callback) {
            MecaKeyboard.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        memkeyboard_count: function(callback) {
            MemKeyboard.countDocuments({}, callback);
        },
        switchKey_count: function(callback) {
            SwitchKey.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Keyboard Inventory Home', error: err, data: results });
    });
};

// Display list of all mecakeyboards.
exports.mecakeyboard_list = function(req, res, next) {
   MecaKeyboard.find()
        .sort([['name', 'ascending']])
        .exec(function (err, mecakeyboard_list) {
            if (err) { return next(err); }
            //Sucessful, so render
            res.render('mecakeyboard_list', { title: 'Mechanical keyboard list', mecakeyboard_list: mecakeyboard_list })
        });
};

// Display detail page for a specific Genre.
exports.mecakeyboard_detail = function(req, res, next) {

    async.parallel({
        mecakeyboard: function(callback) {
            MecaKeyboard.findById(req.params.id)
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.mecakeyboard==null) { // No results.
            var err = new Error('Mechanical keyboard not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('mecakeyboard_detail', { title: results.mecakeyboard.name, mecakeyboard: results.mecakeyboard } );
    });

};

// Display Genre create form on GET.
exports.mecakeyboard_create_get = function(req, res, next) {
  res.render('mecakeyboard_form', { title: 'Add mecakeyboard' });
  };

// Handle Genre create on POST.
exports.mecakeyboard_create_post =  [

    // Validate and sanitize the name field.
    body('name', 'name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'description').escape(),
    body('price', 'Price must not be empty').trim().isLength({ min : 1 }).escape(),
    body('number_in_stock', 'Number in stock must not be empty').trim().isLength({ min : 1 }).escape(),
    body('brand', 'Brand must not be empty').trim().isLength({ min : 1}).escape(),
    body('layout', 'layout').trim().escape(),
    body('image', 'image').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      // Create a genre object with escaped and trimmed data.
    

      if(!req.file) {
        var mecakeyboard = new MecaKeyboard(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            brand: req.body.brand,
            layout: req.body.layout,
            
           });
        
      } else if (req.file !== undefined) {
        var mecakeyboard = new MecaKeyboard(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            brand: req.body.brand,
            layout: req.body.layout,
            images: req.file.filename,
           });
      }

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('mecakeyboard_form', { title: 'Add mechanical keyboard', mecakeyboard: mecakeyboard, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        MecaKeyboard.findOne({ 'name': req.body.name })
          .exec( function(err, found_mecakeyboard) {
             if (err) { return next(err); }
  
             if (found_mecakeyboard) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_mecakeyboard.url);
             }
             else {
  
               mecakeyboard.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(mecakeyboard.url);
               });
  
             }
  
           });
      }
    }
  ];


// Display Genre delete form on GET.
exports.mecakeyboard_delete_get = function(req, res, next) {

  async.parallel({
      mecakeyboard: function(callback) {
          MecaKeyboard.findById(req.params.id).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.mecakeyboard==null) { // No results.
          res.redirect('/inventory/mecakeyboard');
      }
      // Successful, so render.
      res.render('mecakeyboard_delete', { title: 'Delete mechanical keyboard', mecakeyboard: results.mecakeyboard } );
  });

};

exports.mecakeyboard_delete_post = [

  body('inputPass', 'Your password is incorrect.').trim().equals("admin").escape(),
(req, res, next) => {
  const errors = validationResult(req);

  async.parallel({
      mecakeyboard: function(callback) {
        MecaKeyboard.findById(req.body.mecakeyboardid).exec(callback)
      },
  }, function(err, results) {
        if (err) { return next(err);}
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all authors and genres for form.
          async.parallel({
            mecakeyboard: function(callback) {
              MecaKeyboard.findById(req.body.mecakeyboardid).exec(callback)
            },
          }, function(err, results) {
              if (err) { return next(err); }
              res.render('mecakeyboard_delete', { title: 'DElete Mechanical keyboard', mecakeyboard: results.mecakeyboard, errors: errors.array() });
          });
          return;
      } else {
            MecaKeyboard.findByIdAndRemove(req.body.mecakeyboardid, function deleteMecaKeyboard(err) {
                if (err) { return next(err); }
            res.redirect('/inventory/mecakeyboards')
            })
          }
        })
    }
]

// Display Genre update form on GET.
exports.mecakeyboard_update_get = function(req, res, next) {

  // Get book, authors and genres for form.
  async.parallel({
      mecakeyboard: function(callback) {
          MecaKeyboard.findById(req.params.id).exec(callback);
      },
    }, function(err, results) {
          if (err) { return next(err); }
          if (results.mecakeyboard==null) { // No results.
              var err = new Error('Mechanical keyboard not found');
              err.status = 404;
              return next(err);
          }
          res.render('mecakeyboard_form', { title: 'Update Mechanical keyboard', mecakeyboard: results.mecakeyboard });
      });

};
// Handle Genre update on POST.
exports.mecakeyboard_update_post = [

  // Validate and sanitize fields.
  body('name', 'name must not be empty.').trim().escape(),
  body('description', 'description').escape(),
  body('price', 'Price must not be empty').trim().escape(),
  body('number_in_stock', 'Number in stock must not be empty').trim().escape(),
  body('brand', 'Brand must not be empty').trim().escape(),
  body('layout', 'layout').escape(),
  body('image', 'image').trim().escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Book object with escaped/trimmed data and old id.
    
      if(!req.file) {
        var mecakeyboard = new MecaKeyboard(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            brand: req.body.brand,
            layout: req.body.layout,
            _id: req.params.id,
           });
        
      } else if (req.file !== undefined) {
        var mecakeyboard = new MecaKeyboard(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            brand: req.body.brand,
            layout: req.body.layout,
            images: req.file.filename,
            _id: req.params.id,
           });
      }


      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all authors and genres for form.
          async.parallel({
              mecakeyboard: function(callback) {
                  MecaKeyboard.find(callback);
              },
          }, function(err, results) {
              if (err) { return next(err); }
              res.render('mecakeyboard_form', { title: 'Update Mechanical keyboard', mecakeyboard: mecakeyboard, errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid. Update the record.
          MecaKeyboard.findByIdAndUpdate(req.params.id, mecakeyboard, {}, function (err,themecakeyboard) {
              if (err) { return next(err); }
                 // Successful - redirect to book detail page.
                 res.redirect(themecakeyboard.url);
              });
      }
  }
];