var MecaKeyboard = require('../models/mecakeyboard');
var switchKey = require('../models/switchKey')
var SwitchKey = require('../models/switchKey')
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all mecakeyboards.
exports.switchKey_list = function(req, res, next) {
    SwitchKey.find()
         .sort([['name', 'ascending']])
         .exec(function (err, switchKey_list) {
             if (err) { return next(err); }
             //Sucessful, so render
             res.render('switchKey_list', { title: 'Switches list', switchKey_list: switchKey_list })
         });
 };
 
// Display detail page for a specific Genre.
exports.switchKey_detail = function(req, res, next) {

    async.parallel({
        switchKey: function(callback) {
            SwitchKey.findById(req.params.id)
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.switchKey==null) { // No results.
            var err = new Error('Switch not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('switchKey_detail', { title: results.switchKey.name, switchKey: results.switchKey } );
    });

};

// Display Genre create form on GET.
exports.switchKey_create_get = function(req, res, next) {
    res.render('switchKey_form', { title: 'Create switch' });
  };

// Handle Genre create on POST.
exports.switchKey_create_post =  [

    // Validate and sanitize the name field.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'description').escape(),
    body('price', 'Price must not be empty').trim().isLength({ min : 1 }).escape(),
    body('number_in_stock', 'Number in stock must not be empty' ).trim().isLength({ min: 1 }).escape(),
    body('type', 'Type must not be empty').trim().isLength({ min : 1 }).escape(),
    body('image', 'image').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);


      if(!req.file) {
        var switchKey = new SwitchKey(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            brand: req.body.brand,
            layout: req.body.layout,
            
           });
        
      } else if (req.file !== undefined) {
        var switchKey = new SwitchKey(
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
        res.render('switchKey_form', { title: 'Create switch', switchKey: switchKey, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        SwitchKey.findOne({ 'name': req.body.name })
          .exec( function(err, found_switchKey) {
             if (err) { return next(err); }
  
             if (found_switchKey) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_switchKey.url);
             }
             else {
  
               switchKey.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(switchKey.url);
               });
  
             }
  
           });
      }
    }
  ];


// Display Genre delete form on GET.
exports.switchKey_delete_get = function(req, res, next) {

  async.parallel({
      switchKey: function(callback) {
          SwitchKey.findById(req.params.id).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.switchKey==null) { // No results.
          res.redirect('/inventory/switchKey');
      }
      // Successful, so render.
      res.render('switchKey_delete', { title: 'Delete switch', switchKey: results.switchKey } );
  });

};

  // Handle Genre delete on POST.
  exports.switchKey_delete_post = [

    body('inputPass', 'Your password is incorrect.').trim().equals("admin").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
  
    async.parallel({
        switchKey: function(callback) {
          SwitchKey.findById(req.body.switchKeyid).exec(callback)
        },
    }, function(err, results) {
          if (err) { return next(err);}
          if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
  
            // Get all authors and genres for form.
            async.parallel({
              switchKey: function(callback) {
                SwitchKey.findById(req.body.switchKeyid).exec(callback)
              },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('switchKey_delete', { title: 'Delete Switch', switchKey: results.switchKey, errors: errors.array() });
            });
            return;
        } else {
              SwitchKey.findByIdAndRemove(req.body.switchKeyid, function deleteSwitchKey(err) {
                  if (err) { return next(err); }
              res.redirect('/inventory/switchKeys')
              })
            }
          })
      }
  ]
// Display Genre update form on GET.
exports.switchKey_update_get = function(req, res, next) {

  // Get book, authors and genres for form.
  async.parallel({
      switchKey: function(callback) {
          SwitchKey.findById(req.params.id).exec(callback);
      },
    }, function(err, results) {
          if (err) { return next(err); }
          if (results.switchKey==null) { // No results.
              var err = new Error('Switch not found');
              err.status = 404;
              return next(err);
          }
          res.render('switchKey_form', { title: 'Update Switch', switchKey: results.switchKey });
      });

};
// Handle Genre update on POST.
exports.switchKey_update_post = [

  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'description').escape(),
  body('price', 'Price must not be empty').trim().isLength({ min : 1 }).escape(),
  body('number_in_stock', 'Number in stock must not be empty').trim().isLength({ min : 1 }).escape(),
  body('type', 'Type must not be empty').trim().isLength({ min : 1 }).escape(),
  body('image', 'image').trim().escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Book object with escaped/trimmed data and old id.
    
      if(!req.file) {
        var switchKey = new SwitchKey(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            type: req.body.type,
            _id: req.params.id,
           });
        
      } else if (req.file !== undefined) {
        var switchKey = new SwitchKey(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            type: req.body.type,
            images: req.file.filename,
            _id: req.params.id,
           });
      }


      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all authors and genres for form.
          async.parallel({
              switchKey: function(callback) {
                  SwitchKey.find(callback);
              },
          }, function(err, results) {
              if (err) { return next(err); }
              res.render('switchKey_form', { title: 'Update switch', switchKey: switchKey, errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid. Update the record.
          SwitchKey.findByIdAndUpdate(req.params.id, switchKey, {}, function (err,theswitchKey) {
              if (err) { return next(err); }
                 // Successful - redirect to book detail page.
                 res.redirect(theswitchKey.url);
              });
      }
  }
];
