var fs = require('fs');
var moment = require('moment');

var title = process.argv[2]

var header = 
    '---' +
    '\nlayout: post' + 
    '\ntitle: ' + title + 
    '\ndate: ' + moment().format('YYYY-MM-DD h:mm:ss') + 
    '\n---\n\n'
      
var filename = moment().format('YYYY-MM-DD')
    + '-'
    + title.replace(' ', '-').toLowerCase()

fs.writeFile('./src/posts/' + filename + '.md', header, function (err) {
    if (err) throw err
});
