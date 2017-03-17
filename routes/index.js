var express = require('express');
var router = express.Router();
var contentful = require('contentful');
var marked = require('marked');
require('dotenv').config();

/* Redirects for external articles */
router.get('/wordpress-sidebar', function(req, res) {
	res.redirect('http://wearemammoth.com/2016/10/wordpress-tutorial-generating-sidebar-categories-posts');
});
router.get('/unity-arcade-game', function(req, res) {
	res.redirect('https://recompilermag.com/issues/issue-3/creating-a-2d-arcade-game-with-javascript-in-unity-5/');
});

/* GET home page */
router.get('/', function(req, res, next) {

  	var client = contentful.createClient({
		space: process.env.CF_SPACE,
		accessToken: process.env.CF_ACCESS_TOKEN
	});

	var entries = { blog: null, project: null };

	client.getEntries({
		'content_type': 'blogPost',
		'order': '-fields.datePublished'
	})
	.then(function (blogEntries) {
		if(blogEntries.items.length === 0)
			return next();

		entries.blog = blogEntries;

		entries.blog = entries.blog.items.map(function(item){
			var date = (item.fields.datePublished).split('-');
			var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			item.fields.datePublished = months[date[1]] + ' ' + date[2].replace(/(^|-)0+/g, "$1") + ', ' + date[0];
			return item;
		});

		return client.getEntries({
			'content_type': 'project',
			'order': 'fields.sort'
		});
	})
	.then(function (projectEntries){
		if(projectEntries.items.length === 0)
			return next();

		entries.project = projectEntries;

		var projectItems = entries.project.items.map(function(item){
			item.fields.projectInfo = marked(item.fields.projectInfo);
			return item;
		});

		res.render('index', { projectEntries: projectItems, blogEntries: entries.blog });
	})
	.catch(function(err){
		next(err);
	});
});

/* GET blog post pages */
router.get('/:slug', function(req, res, next) {
	var client = contentful.createClient({
		space: process.env.CF_SPACE,
		accessToken: process.env.CF_ACCESS_TOKEN
	});
	client.getEntries({
		'content_type': 'blogPost',
		'fields.slug': req.params.slug
	})
	.then(function (entries) {
		if(entries.items.length === 0)
			return next();

		var entry = entries.items[0];
		var body = marked(entry.fields.body);

		var date = (entry.fields.datePublished).split('-');
		var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		date = months[date[1]] + ' ' + date[2].replace(/(^|-)0+/g, "$1") + ', ' + date[0];

		res.render('single', { title: entry.fields.title, body: body, date: date });
	})
	.catch(function(err){
		next(err);
	});
});

module.exports = router;
