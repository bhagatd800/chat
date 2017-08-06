var express = require('express');
var router = express.Router();
var fs = require('fs');
var Remarkable = require('remarkable');
var md = new Remarkable();

/* GET home page. */
router.get('/comment_box', function(req, res, next) {
  fs.readFile('db/comments.json', function(err, data) {
    var comments = JSON.parse(data);
    comments = comments.map(function(comment, comment_box, array) {
      return {author: comment.author, text: md.render(comment.text)};
    });
    res.render('comment_box', {title: 'Comment Box Example', comments: comments});
  });
});

/* POST home page. */
router.post('/comment', function(req, res) {
  console.log(req.body);
  fs.readFile('db/comments.json', function(err, data) {
    var comments = JSON.parse(data);
    req.body.id = Date.now();
    comments.push(req.body);
    fs.writeFile('db/comments.json', JSON.stringify(comments, null, 4), function(err) {
      comments = comments.map(function(comment, comment_box, array) {
        return {author: comment.author, text: md.render(comment.text)};
      });
      res.render('comment_box', {title: 'Comment Box Example', comments: comments});
    });
  });
});

module.exports = router;
