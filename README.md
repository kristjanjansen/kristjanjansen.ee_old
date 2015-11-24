### About

My personal blog ported from Jekyll to Metalsmith

### Setup

    npm install

Then fill the ```src/posts``` with Markdown files and 

    node build

### Adding new post

    node add "Post title"

### Adding Twitter posts

    cp example.config.json config.json

Fill in Twitter API credentials to ```config.json``` and

    node twitter

