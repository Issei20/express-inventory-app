var express = require('express');
var router = express.Router();
const multer  = require('multer')
var MecaKeyboard = require('../models/mecakeyboard');
var MemKeyboard = require('../models/memkeyboard');
var SwitchKey = require('../models/switchKey')
const path = require('path')
var async = require('async');

// Require controller modules.
var mecakeyboard_controller = require('../controllers/mecakeyboardController');
var memkeyboard_controller = require('../controllers/memkeyboardController');
var switchKey_controller = require('../controllers/switchKeyController');

/// mecakeyboard ROUTES ///
const upload = multer({ dest: './routes/uploads/' })
// GET catalog home page.
router.get('/', mecakeyboard_controller.index);


router.get('/uploads/:name', function(req, res, next) {
    async.parallel({
        mecakeyboard: function(callback) {
            MecaKeyboard.find({ images : req.params.name})
              .exec(callback);
        },
        memkeyboard: function(callback) {
          MemKeyboard.find({ images : req.params.name})
            .exec(callback);
      },
        switchKey: function(callback) {
        SwitchKey.find({ images : req.params.name})
          .exec(callback);
    },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.mecakeyboard==null) { // No results.
            var err = new Error('Mechanical keyboard not found');
            err.status = 404;
            return next(err);
        }
       let p = path.join(__dirname, 'uploads/'+req.params.name)
        // Successful, so render
        res.sendFile(p);
    });
})
// GET request for creating a mecakeyboard. NOTE This must come before routes that display mecakeyboard (uses id).
router.get('/mecakeyboard/create', mecakeyboard_controller.mecakeyboard_create_get);

// POST request for creating mecakeyboard.
router.post('/mecakeyboard/create', upload.single('image'), mecakeyboard_controller.mecakeyboard_create_post);

// GET request to delete mecakeyboard.
router.get('/mecakeyboard/:id/delete', mecakeyboard_controller.mecakeyboard_delete_get);

// POST request to delete mecakeyboard.
router.post('/mecakeyboard/:id/delete', mecakeyboard_controller.mecakeyboard_delete_post);

// GET request to update mecakeyboard.
router.get('/mecakeyboard/:id/update', mecakeyboard_controller.mecakeyboard_update_get);

// POST request to update mecakeyboard.
router.post('/mecakeyboard/:id/update', upload.single('image'), mecakeyboard_controller.mecakeyboard_update_post);

// GET request for one mecakeyboard.
router.get('/mecakeyboard/:id', mecakeyboard_controller.mecakeyboard_detail);

// GET request for list of all mecakeyboard items.
router.get('/mecakeyboards', mecakeyboard_controller.mecakeyboard_list);

/// memkeyboard ROUTES ///

// GET request for creating memkeyboard. NOTE This must come before route for id (i.e. display memkeyboard).
router.get('/memkeyboard/create', memkeyboard_controller.memkeyboard_create_get);

// POST request for creating memkeyboard.
router.post('/memkeyboard/create',  upload.single('image'), memkeyboard_controller.memkeyboard_create_post);

// GET request to delete memkeyboard.
router.get('/memkeyboard/:id/delete', memkeyboard_controller.memkeyboard_delete_get);

// POST request to delete memkeyboard.
router.post('/memkeyboard/:id/delete', memkeyboard_controller.memkeyboard_delete_post);

// GET request to update memkeyboard.
router.get('/memkeyboard/:id/update', memkeyboard_controller.memkeyboard_update_get);

// POST request to update memkeyboard.
router.post('/memkeyboard/:id/update',  upload.single('image'), memkeyboard_controller.memkeyboard_update_post);

// GET request for one memkeyboard.
router.get('/memkeyboard/:id', memkeyboard_controller.memkeyboard_detail);

// GET request for list of all memkeyboards.
router.get('/memkeyboards', memkeyboard_controller.memkeyboard_list);

/// switchKey ROUTES ///

// GET request for creating a switchKey. NOTE This must come before route that displays switchKey (uses id).
router.get('/switchKey/create', switchKey_controller.switchKey_create_get);

//POST request for creating switchKey.
router.post('/switchKey/create',  upload.single('image'), switchKey_controller.switchKey_create_post);

// GET request to delete switchKey.
router.get('/switchKey/:id/delete', switchKey_controller.switchKey_delete_get);

// POST request to delete switchKey.
router.post('/switchKey/:id/delete', switchKey_controller.switchKey_delete_post);

// GET request to update switchKey.
router.get('/switchKey/:id/update', switchKey_controller.switchKey_update_get);

// POST request to update switchKey.
router.post('/switchKey/:id/update',  upload.single('image'), switchKey_controller.switchKey_update_post);

// GET request for one switchKey.
router.get('/switchKey/:id', switchKey_controller.switchKey_detail);

// GET request for list of all switchKey.
router.get('/switchKeys', switchKey_controller.switchKey_list);


module.exports = router;