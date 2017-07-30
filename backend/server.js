// var express = require('express');
// var bodyParser = require('body-parser');
// var passport = require('passport');
// var LocalStrategy = require('passport-local');
// var session = require('express-session');
//
// var app = express();
//
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
//
// // PASSPORT FLOW
//
// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
//
// passport.use(new LocalStrategy(function(username, password, done) {
//   // Find the user with the given username
//   User.findOne({ username: username }, function (err, user) {
//     // if there's an error, finish trying to authenticate (auth failed)
//     if (err) {
//       console.log(err);
//       return done(err);
//     }
//     // if no user present, auth failed
//     if (!user) {
//       return done(null, false, { message: 'Incorrect username.' });
//     }
//     // if passwords do not match, auth failed
//     if (user.password !== password) {
//       return done(null, false, { message: 'Incorrect password.' });
//     }
//     // auth has has succeeded
//     return done(null, user);
//   });
// }));
//
// app.use(session({ secret: 'frank_ocean' }));
// app.use(passport.initialize());
// app.use(passport.session());
//
// app.post('/register', function(req, res) {
//   var newUser = new User({
//     username: req.body.username,
//     password: req.body.password
//   });
//   newUser.save(function(err, user) {
//     if (err) {
//       console.log(err);
//       return;
//     } else {
//       console.log(user);
//       res.json({success: true});
//     }
//   });
// });
//
// app.post('/login', passport.authenticate('local', { failureRedirect: '/failed' }), function(req, res) {
//   res.json({success: true});
// });
//
// app.get('/failed', function(req, res) {
//   res.json({success: false});
// });
//
// app.post('/newdoc', function(req, res) {
//
//   console.log("USER LOGGED IN ", req.user);
//
//   var date = new Date();
//   var time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//
//   var newHistory = {
//     time: time,
//     editorState: req.body.editorState
//   }
//
//   console.log('NEW HISTORY FOR NEW DOC ', newHistory);
//
//   // User.findOne({username: })
//   var newDoc = new Document({
//     title: req.body.title,
//     ownerIDs: [req.user._id],
//     collaboratorIDs: [req.user._id],
//     hashedpassword: req.body.password,
//     editorState: req.body.editorState,
//     history: newHistory
//   });
//
//   newDoc.save(function(err, doc) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log('SAVED NEW DOC', doc);
//     res.json({
//       success: true,
//       document: doc
//     });
//   });
// });
//
// app.post('/deletedoc', function(req, res) {
//   Document.findByIdAndRemove(req.body.docID, function(err){
//     if(err){
//       res.json(err);
//       return;
//     }
//     res.json({sucess: true});
//   });
// });
//
// app.get('/getdocs', function(req, res) {
//
//   var user_id = req.user._id;
//   var found_docs = [];
//
//   Document.find({}, function( err, documents ) {
//     if(err){
//       res.json({
//         success: false
//       });
//       return;
//     }
//
//     for(var i = 0; i < documents.length; i++){
//       if(documents[i].collaboratorIDs.indexOf(user_id) !== -1){
//         found_docs.push(documents[i]);
//       }
//     }
//
//     res.json({
//       success: true,
//       found_docs: found_docs
//     });
//   });
// });
//
// app.post('/retrieval', function(req, res) {
//   Document.findById(req.body.docID, function(err, document) {
//     if(err) {
//       console.log('There was an error :(', err);
//     } else {
//       console.log('we are finding by this ID', req.body.docID);
//       console.log('this is the document', document);
//       res.json(document);
//     }
//   });
// });
//
// app.post('/history', function(req, res) {
//   Document.findById(req.body.docID, function(err, document) {
//     if(err) {
//       console.log('errrrrrr ', err);
//     } else {
//       var histories = document.history;
//       for(var i = 0; i < histories.length; i++){
//         if(histories[i].time.indexOf(req.body.time) !== -1){
//           res.json({
//             time: histories[i].time,
//             editorState: histories[i].editorState
//           })
//           return;
//         }
//       }
//
//       console.log("didnt find a history for that");
//       res.send(500);
//
//     }
//   });
// })
//
// app.post('/search-shared', function(req, res) {
//   // searches for a document with the docid provided by the user in docportal search
//   console.log('HERE FOR NOW ', typeof req.body.docID);
//
//   if(req.body.docID.length !== 24){
//     res.json({
//       success: false,
//       message: 'Invalid DocID'
//     });
//     return;
//   }
//
//   Document.findById(req.body.docID, function(err, doc) {
//     if(err) {
//       console.log("There was an error :)", err);
//       res.json({
//         success: false,
//         message: 'Error accessing mongoose'
//       });
//       return;
//     }
//
//     if(doc){
//       if(doc.hashedpassword !== req.body.password){
//         // if found but password is wrong. tell them incorrect password
//         res.json({
//           success: false,
//           message: 'Incorrect password'
//         });
//       }else{
//         // if found with correct password. add them as a collab by adding their id. and tell them success
//         if(doc.collaboratorIDs.indexOf(req.user._id) === -1){
//           doc.collaboratorIDs.push(req.user._id);
//         }
//         doc.save( function(err, d) {
//           if(err) {
//             res.json({
//               success: false,
//               message: "Error updating collaborator ids"
//             });
//           }else{
//             res.json({
//               success: true,
//               message: "Collaborato ids updated"
//             });
//           }
//         });
//       }
//     }else{
//       // if not found. tell them document doesn't exist
//       res.json({
//         success: false,
//         message: 'Document does not exist with that id'
//       });
//     }
//   });
// });
//
// app.post('/save', function(req, res) {
//   console.log(typeof req.body.editorState);
//   Document.findById(req.body.docID, function(err, document) {
//     if(err) {
//       console.log('There was an error :(', err);
//     }
//     if(document) {
//       var date = new Date();
//       var time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//
//       var newHistory = {
//         time: time,
//         editorState: req.body.editorState
//       }
//       console.log('new history for new save ', newHistory)
//
//       document.editorState = req.body.editorState;
//       document.history = document.history.concat(newHistory);
//       document.save(function(err) {
//         if(err) {
//           console.log('There was an err :(', err);
//         } else {
//           res.json({
//             history: document.history
//           });
//         }
//       });
//     }
//   });
// });
//
// app.post('/search-shared', function(req, res) {
//   // searches for a document with the docid provided by the user in docportal search
//   Document.findById(req.body.docID, function(err, doc) {
//     if(err) {
//       console.log("There was an error :)", err);
//       res.json({
//         success: false,
//         message: 'Error accessing mongoose'
//       });
//       return;
//     }
//
//     if(doc){
//       if(doc.hashedpassword !== req.body.password){
//         // if found but password is wrong. tell them incorrect password
//         res.json({
//           success: false,
//           message: 'Incorrect password'
//         });
//       } else {
//         // if found with correct password. add them as a collab by adding their id. and tell them success
//         if(doc.collaboratorIDs.indexOf(req.user._id) === -1){
//           doc.collaboratorIDs.push(req.user._id);
//         }
//         doc.save( function(err, d) {
//           if(err) {
//             res.json({
//               success: false,
//               message: "Error updating collaborator ids"
//             });
//           } else {
//             res.json({
//               success: true,
//               message: "Collaborator ids updated"
//             });
//           }
//         });
//       }
//     } else{
//         // if not found. tell them document doesn't exist
//       res.json({
//         success: false,
//         message: 'Document does not exist with that id'
//       });
//     }
//   });
// });
//
// // need to fix this
// app.get('/logout', function(req, res) {
//   console.log('LOGGING OUT----------- REQ.SESSION', req.session);
//   console.log('LOGGING OUT----------- REQ.LOGOUT', req.logout());
//   req.logout();
//   res.redirect('/login');
// });
//
// app.listen(process.env.PORT || 3000, function () {
//   console.log('Backend server for Sygnal App running on port 3000!');
// });
