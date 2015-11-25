buildDate = require('metalsmith-build-date');
collections = require('metalsmith-collections')
each = require('metalsmith-each')
filenames = require('metalsmith-filenames') 
htmlMinifier = require("metalsmith-html-minifier");
ignore = require('metalsmith-ignore')
jekyllDates = require('metalsmith-jekyll-dates')
layouts = require('metalsmith-layouts')
markdown = require('metalsmith-markdown')
metalsmith = require('metalsmith')
moment = require('moment')
permalinks = require('metalsmith-permalinks')
swigHelpers = require('metalsmith-swig-helpers');

config = require('./config.json')

metalsmith(__dirname)
    .use(filenames())
    .use(buildDate())
    .use(jekyllDates())
    .metadata({
        site: config.site
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
                return collection.slice(0, limit)
            },
            'tag': function(collection, filterTag) {
                if (! filterTag) return collection
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
            'images': function(content) {
                return content.toString().replace(/files\/images\//g, 'files/images/medium/')
            }
        }
    }))
    .use(layouts({
        engine: 'swig',
        moment: moment
    }))
//  .use(htmlMinifier())
    .build(function (err) {
        if (err) { console.log(err) }
    })

// Rinku.auto_link(input.gsub('--', '&mdash;').gsub('files/images', 'files/images/medium'))
