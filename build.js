metalsmith = require('metalsmith')
collections = require('metalsmith-collections')
each = require('metalsmith-each')
filenames = require('metalsmith-filenames') 
ignore = require('metalsmith-ignore')
jekyllDates = require('metalsmith-jekyll-dates')
layouts = require('metalsmith-layouts')
markdown = require('metalsmith-markdown')
permalinks = require('metalsmith-permalinks')
moment = require('moment')
swigHelpers = require('metalsmith-swig-helpers');

metalsmith(__dirname)
    .use(filenames())
    .use(jekyllDates())
    .metadata({
        site: {
            title: 'Kristjan Jansen',
            url: 'http://kristjanjansen.ee',
            email: 'kristjan.jansen@gmail.com',
            slogan: '&#44 interaction designer. I <a href="/teaching">teach</a> and <a href="/presentations">talk</a> and have a <a href="/podcast">podcast</a>. Here\'s my <a href="/files/kristjan_jansen_portfolio.pdf">portfolio</a>. Find me in <a href="http://twitter.com/kristjanjansen">Twitter</a>, <a href="http://facebook.com/kristjanjansen">Facebook</a>, <a href="http://ee.linkedin.com/pub/kristjan-jansen/15/b06/778">LinkedIn</a>, <a href="http://github.com/kristjanjansen">Github</a>, <a href="https://instagram.com/kristjanjansen/">Instagram< and <a href="mailto:kristjan.jansen@gmail.com">Gmail</a>.',
            footer: 'All content in this site is licenced under <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons</a> licence.'
        }
    })
    .use(collections({
        posts: {
            pattern: 'posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(markdown())
    .use(
        each(function (file, filename) {
            if (file.layout == 'post') {
               file.layout = 'post.html'
            }
            if (!file.permalink && file.date) {
               file.permalink = file.title
            }
        }
    ))
    .use(permalinks({
        pattern: 'post/:permalink'
    }))
    .use(swigHelpers({
        filters: {
            'limit': function(collection, limit) {
                return collection.slice(0, limit);
            },
            'tag': function(collection, filterTag) {
                return collection.filter(function(post) {
                    if (!post.tags) return false
                    return post.tags.indexOf(filterTag) > -1
                });
            },
            'notwitter': function(collection) {
                return collection.filter(function(post) {
                    return ! post.hasOwnProperty('twitter_url')
                });
            },
        }
    }))
    .use(layouts({
        engine: 'swig',
        moment: moment
    }))
    .build(function (err) {
        if (err) { console.log(err) }
    })

