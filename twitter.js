var fs = require('fs');
var each = require('each');
var ntwitter = require('ntwitter');
var moment = require('moment');
var request = require('request');

var config = require('./config.json')

var twit = new ntwitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
});

var screen_name = config.screen_name

twit.getUserTimeline({screen_name: screen_name, count: 5, exclude_replies: false}, function (err, item) {

    each(item).on('item', function(data, i, next) {

        var header = 
            '---' +
            '\ntitle: twitter ' + data.id_str + 
            '\ndate: ' + moment(data.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').format('YYYY-MM-DD h:mm:ss') + 
            '\npermalink: ' + 'twitter/' + data.id_str + 
            '\ntwitter_url: ' + 'http://twitter.com/' + screen_name + '/status/' + data.id_str + 
            '\n---\n'
            
        var body = data.text

        expandUrls(body, function(body) {
         
            body = body
                .replace(/\B#([^ ]+)/ig, '<a href="https://twitter.com/search?q=' + encodeURIComponent('#') + '$1">#$1</a>')
                .replace(/\B\@([^ ]+)/ig, '<a href="https://twitter.com/$1">@$1</a>')
          
            filename = moment(data.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').format('YYYY-MM-DD') + '-twitter-' + data.id_str
          
            fs.writeFile('./src/posts/' + filename + '.md', header + '\n' + body, function (err) {
                if (err) throw err
            });
          
            next()             
       
        })

    })
   
});



function expandUrls(str, callback) {
 
    var matches = str.match(/((^|\s)(https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi)
    
    if (matches) {
    
        each(matches).on('item', function(url, index, next) {
    
            request({
                method: "HEAD",
                url: url,
                followAllRedirects: true
            }, 
            function(err, req, body) {
                if (!err) {
                    str = str.replace(url, ' ' + req.request.href)
                }
                next()   
            })
            
        })
        .on('end', function() {
        
            return callback(str)
        
        });

    } else {
        
        return callback(str)

    }

}
