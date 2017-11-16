'use strict'

var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
module.exports=router;

//GET /wiki
router.get('/', function(req, res, next) {
  Page.findAll({})
      .then(function(thepages){
        res.render('index', {
          pages: thepages
        });
      })
      .catch(next);
});

//POST /wiki

router.post('/', function(req, res, next){
  User.findOrCreate({
    where: {
      email: req.body.authorEmail,
      name: req.body.authorName
    }
  })
})
.spread(function(user, wasCreatedBool){
  return Page.create({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    tags: req.body.tags
  })
  .then(function(createdPage){
    res.redirect(createdPage.route);
  })
  .catch(next);
});

/* //post wiki 
router.post('/', function(req, res, next) {
  var page = Page.build({
  	title: req.body.title[2],
  	content: req.body.title[3]
  });
   //console.log('Page', page);
    page.save()
    .then(function(savedPage){
    	res.redirect(savedPage.route);
    })
    .catch(function(err){
    	console.error(err);
    });
  //console.log(req.body);
});
*/


//get /wiki/add
router.get('/add', function(req, res, next) {
  res.render('addpage');
});


router.get('/search/:tag', function(req, res, next){
  Page.findByTag(req.params.tag)
      .then(function(pages){
        res.render('index', {
          pages: pages
        });
      })
      .catch(next);
});

router.get('/:urlTitle', function(req, res, next){
  var urlTitleOfAPage=req.params.urlTitle;
  Page.findOne({ // returns the page instance as a promise (find it using the urlTitle)
    where: {
      urlTitle: 'req.params.urlTitle'
    }
  })
  .then(function(foundPage) {
    if (!foundPage){
      var error=new Error('that page was not found!');
      error.status=404;
      throw error;
    }
    return page.getAuthor(){
               .then(function(author){
                page.author=author;
                res.render('wikipage', {page});
               });

    }
     // Render the wikipage template, passing the retrieved page as the page property of the locals object of the render function.
  })
  .catch(next);
});




router.get('/:urlTitle/similr', function(req, res, next){
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
   .then(function(page){
    if (!page){
      var error = new Error('that page was not found!');
      error.status=404;
      throw error;
    }
    return page.findSimilar();
   })
   .then(function(similarPages){
    res.render('index', {
      pages: similarPages
    });
   })
   .catch(next);
});


//editing functionality
router.get('/:urlTitle/edit', function(req, res, next){
  Page.findOne({
    where:{
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(page){
    if (!page){
      var error = new Error('that page was not found!');
      error.status=404;
      throw error;
    }
    res.render('editpage', {
      page: page
    });
  })
  .catch(next)
})

router.post('/:urlTitle/edit', function(req, res, next){
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
     .then(function(page){
      for (var key in req.body){
        page[key]=req.body[key];
      }
      return page.save();
     })
     .then(function(updatedPage){
      res.redirect(updatedPage.route);
     })
     .catch(next);
});


router.get('/:urlTitle/delete', function(req, res, next){
  Page.destroy({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
    .then(function(){
      res.redirect('/wiki');
    })
    .catch(next);
})






















//











module.exports = router;
