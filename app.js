var express           = require('express');
var path              = require('path');
var favicon           = require('serve-favicon');
var logger            = require('morgan');
var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');
var exphbs            = require('express-handlebars');
var expressValidator  = require('express-validator');
var flash             = require('connect-flash');
var session           = require('express-session');
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
var nodemailer        = require('nodemailer');
var mongo             = require('mongodb');
var mongoose          = require('mongoose');
//var io = require('socket.io')(http);
var server            = require('http').createServer(app);
var io                = require('socket.io')(server);

mongoose.connect('mongodb://127.0.0.1/major');
var db = mongoose.connection;

var routes      = require('./routes/index');
var chat        = require('./routes/chat');
var users       = require('./routes/users');
var hirers      = require('./routes/hirers');
var job         = require('./routes/job');
var file        = require('./routes/file');
var setting     = require('./routes/setting');
var comment_box = require('./routes/comment_box');
var comments    = require('./routes/comments');
var contact_us  = require('./routes/contact_us');
var contact     = require('./routes/contact');

/**
 *
 * Handlebar register helper
 *
 */
var hbs = exphbs.create({
    defaultLayout: 'layout',
    // Specify helpers which are only registered on this instance.
    helpers: {
        times: function(n, block) {
            var accum = '';
            for(var i = 0; i < n; ++i)
                accum += block.fn(i);
            return accum;
        },
        math: function(lvalue, operator, rvalue, options) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
                
            return {
                "+": parseInt(lvalue + rvalue),
                "-": parseInt(lvalue - rvalue),
                "*": parseInt(lvalue * rvalue),
                "/": parseInt(lvalue / rvalue),
                "%": parseInt(lvalue % rvalue)
            }[operator];
        }
    }
});



/**
 *
 * New changes
 * 
 *
 */
var list    = require('./routes/list');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb'}));
app.use(bodyParser.json());    //req.body

app.use('/', file);


app.use(cookieParser());




// Express Session
app.use(session({
    cookieName: 'session',

    secret: 'secret',

    saveUninitialized: true,

    resave: true,

    duration: 30 * 60 * 1000,

    httpOnly: true,

    secure: true,

    ephemeral: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());



// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root        = namespace.shift()
      , formParam   = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.freelancer = req.freelancer || null;
  res.locals.hirer = req.hirer || null;
  next();
});


 
 
app.use('/', routes);
app.use('/chat', chat);
app.use('/users', users);
app.use('/hirers', hirers);
app.use('/setting', setting);
app.use('/comment_box', comment_box);
app.use('/api/comments', comments);
app.use('/contact_us', contact_us);
app.use('/contact', contact);
/**
 *
 * New changes
 * @author Susmita
 *
 */

app.use('/list', list);
app.use('/job', job);


//
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


//
app.post('/contactus', function (req, res) {
    var mailOpts, smtpTrans;
    //Setup Nodemailer transport, I choose gmail. Create an application-specific password to avoid problems.
    var smtpTransport = require('nodemailer-smtp-transport');
    var transport = nodemailer.createTransport(smtpTransport({
    //smtpTrans = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: "susmitapaudel1226@gmail.com",
      pass: "ldnrtuelihcwjdgp"
    }
    }));
    //Mail options
    mailOpts = {
    from: req.body.name + req.body.email,
    to: 'susmitasharma1226@gmail.com',
    subject: req.body.email + '  --Msg from contactus-form',
    text: "Name: " + req.body.name + "Email: "  + req.body.email + 
          "Contact No:  " + req.body.contactNo + "QUERY: " + req.body.message
    };
    transport.sendMail(mailOpts, function (error, response) {
    //Alert on event of message sent succeeds or fail.
    if (error) {
      res.render('contactus',{msg : 'Error occured, message not sent.', err : true});
    }
    else {
      res.render('contactus',{msg : 'Message sent! Thank you.', err : false});
    }
    transport.close();
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Set Port
app.set('port', (process.env.PORT || 3000));


app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});

