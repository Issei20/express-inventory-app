var MecaKeyboard = require('../models/mecakeyboard');
var MemKeyboard = require('../models/memkeyboard')
var SwitchKey = require('../models/switchKey')
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all mecakeyboards.
exports.memkeyboard_list = function(req, res, next) {
    MemKeyboard.find()
         .sort([['name', 'ascending']])
         .exec(function (err, memkeyboard_list) {
             if (err) { return next(err); }
             //Sucessful, so render
             res.render('memkeyboard_list', { title: 'Membrane keyboard list', memkeyboard_list: memkeyboard_list })
         });
 };
 
// Display detail page for a specific Genre.
exports.memkeyboard_detail = function(req, res, next) {

    async.parallel({
        memkeyboard: function(callback) {
            MemKeyboard.findById(req.params.id)
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.memkeyboard==null) { // No results.
            var err = new Error('Membrane keyboard not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('memkeyboard_detail', { title: results.memkeyboard.name, memkeyboard: results.memkeyboard } );
    });

};

// Display Genre create form on GET.
exports.memkeyboard_create_get = function(req, res, next) {
    res.render('memkeyboard_form', { title: 'Add membrane keyboard' });
  };

// Handle Genre create on POST.
exports.memkeyboard_create_post =  [

    // Validate and sanitize the name field.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'description').escape(),
    body('price', 'Price must not be empty').trim().isLength({ min : 1 }).escape(),
    body('number_in_stock', 'Number in stock must not be empty.').trim().isLength({ min : 1}).escape(),
    body('brand', 'Brand must not be empty').trim().isLength({ min : 1}).escape(),
    body('layout', 'layout').escape(),
    body('image', 'image').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      // Create a genre object with escaped and trimmed data.
      
      if(!req.file) {
        var memkeyboard = new MemKeyboard(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            brand: req.body.brand,
            layout: req.body.layout,
            
           });
        
      } else if (req.file !== undefined) {
        var memkeyboard = new MemKeyboard(
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
        res.render('memkeyboard_form', { title: 'Add membrane keyboard', memkeyboard: memkeyboard, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        MemKeyboard.findOne({ 'name': req.body.name })
          .exec( function(err, found_memkeyboard) {
             if (err) { return next(err); }
  
             if (found_memkeyboard) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_memkeyboard.url);
             }
             else {
  
               memkeyboard.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(memkeyboard.url);
               });
  
             }
  
           });
      }
    }
  ];


// Display Genre delete form on GET.
exports.memkeyboard_delete_get = function(req, res, next) {

  async.parallel({
      memkeyboard: function(callback) {
          MemKeyboard.findById(req.params.id).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.memkeyboard==null) { // No results.
          res.redirect('/inventory/memkeyboards');
      }
      // Successful, so render.
      res.render('memkeyboard_delete', { title: 'Delete membrane keyboard', memkeyboard: results.memkeyboard } );
  });

};


// Handle Genre delete on POST.
exports.memkeyboard_delete_post = [

  body('inputPass', 'Your password is incorrect.').trim().equals("admin").escape(),
(req, res, next) => {
  const errors = validationResult(req);

  async.parallel({
      memkeyboard: function(callback) {
        MemKeyboard.findById(req.body.memkeyboardid).exec(callback)
      },
  }, function(err, results) {
        if (err) { return next(err);}
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all authors and genres for form.
          async.parallel({
            memkeyboard: function(callback) {
              MemKeyboard.findById(req.body.memkeyboardid).exec(callback)
            },
          }, function(err, results) {
              if (err) { return next(err); }
              res.render('memkeyboard_delete', { title: 'Delete membrane keyboard', memkeyboard: results.memkeyboard, errors: errors.array() });
          });
          return;
      } else {
            MemKeyboard.findByIdAndRemove(req.body.memkeyboardid, function deleteMemKeyboard(err) {
                if (err) { return next(err); }
            res.redirect('/inventory/memkeyboards')
            })
          }
        })
    }
]
// Display Genre update form on GET.
exports.memkeyboard_update_get = function(req, res, next) {

  // Get book, authors and genres for form.
  async.parallel({
      memkeyboard: function(callback) {
          MemKeyboard.findById(req.params.id).exec(callback);
      },
    }, function(err, results) {
          if (err) { return next(err); }
          if (results.memkeyboard==null) { // No results.
              var err = new Error('Membrane keyboard not found');
              err.status = 404;
              return next(err);
          }
          res.render('memkeyboard_form', { title: 'Update Membrane keyboard', memkeyboard: results.memkeyboard });
      });

};
// Handle Genre update on POST.
exports.memkeyboard_update_post = [

  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'description').escape(),
  body('price', 'Price must not be empty').trim().isLength({ min : 1 }).escape(),
  body('number_in_stock', 'Number in stock must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('brand', 'Brand must not be empty').trim().isLength({ min : 1}).escape(),
  body('layout', 'layout').escape(),
  body('image', 'image').trim().escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

    
      if(!req.file) {
        var memkeyboard = new MemKeyboard(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            brand: req.body.brand,
            layout: req.body.layout,
            _id: req.params.id,
           });
        
      } else if (req.file !== undefined) {
        var memkeyboard = new MemKeyboard(
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
              memkeyboard: function(callback) {
                  MemKeyboard.find(callback);
              },
          }, function(err, results) {
              if (err) { return next(err); }
              res.render('memkeyboard_form', { title: 'Update Membrane keyboard', memkeyboard: memkeyboard, errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid. Update the record.
          MemKeyboard.findByIdAndUpdate(req.params.id, memkeyboard, {}, function (err,thememkeyboard) {
              if (err) { return next(err); }
                 // Successful - redirect to book detail page.
                 res.redirect(thememkeyboard.url);
              });
      }
  }
];
