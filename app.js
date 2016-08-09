var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoose=require('mongoose');
var app = express();
var Book=require('./Book.model');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

//creating the connection with mongodb
var db='mongodb://localhost/example';
mongoose.connect(db);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended:true
}));
/*
app.get('/',function(req,res){
  res.send('welcome to my page')
});
*/
//Api to reterive document from book collection
app.get('/books',function(req,res){
  //console.log('getting all books');
  Book.find({})
  .exec(function(err,books){
    if(err){
    res.send('error has occured');
  }
  else {
    console.log(books);
    res.json(books);
  }
  });
});


//api to insert new document(record) into collection (table)
app.post('/new',function(req,res) {
  var newBook=new Book();
  newBook.title=req.body.title;
  newBook.author=req.body.author;
  newBook.category=req.body.category;
  newBook.save(function(err,book){
    if (err) {
      res.send('error');
    } else {
      console.log(book);
      res.send(book);
    }
  });
});


//api to update the document (data)
app.post('/updt',function(req,res){
Book.findOneAndUpdate({
  title:req.body.title
},
{$set:{
  title:req.body.title,
  author:req.body.author,
  category:req.body.category
}},
{upsert:true},
function (err,newBook) {
  if (err) {
    console.log('error occured');
  } else {
    console.log(newBook);
    res.send(newBook);
  }
});

});

//api to delete the document (Record)
app.post('/deletedata',function(req,res) {
  Book.remove(
    {title:req.body.title},
function(err,book){
  if (err) {
    console.log('error to remove');
  } else {
    console.log(book);
    res.end();
  }
});
});

app.post('/finding',function(req,res) {
  Book.find(
    {title:req.body.title},
function(err,book){
  if (err) {
    console.log('error to remove');
  } else {
    //console.log(book);
    res.json(book);
    //res.end();
  }
});
});

/*
app.get('/bookde/:title',function(req,res){
  Book.find({
    title:req.params.title
  },function(err,book){
    if (err) {
    //  res.send('error unable to delete');
      console.log('error occured');
    } else {
      console.log(book);
    /*  book.remove(function(er,data){
        if (er) {
          console.log('Error');
        } else {
          console.log('deleted');
        }
      });
*/
      //res.status(204);
      //res.redirect('/views');
/*
      }
});
});
*/


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
