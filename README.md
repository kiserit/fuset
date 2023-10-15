  
# Fuset

Fuset combines multiple files together and returns them in the web response. Fuset will combine the files once at startup and the content in memory for faster responses. 

## Installation
This is a Node.js module available through the npm registry. Installation is done using the npm install command:

```
npm install @kiserit/fuset
```

## Get started

Here's a sample Express app that uses Fuset:

```javascript
const express = require("express");
const cachet = require('@kiserit/fuset');
const UglifyJS = require("uglify-js");

// optionally minify your code
const uglyMinifier = (content) => {
  const result = UglifyJS.minify(content);
  return result?.code || content;
}

const app = express();

app.get('/sample.js', fuset({
    files: [
      './public/sample1.js',
      './public/sample2.js',
      './public/sample3.js'
    ],
    cache: 'max-age=10800',
    mime: 'javascript/text',
    minifier: uglyMinifier,
  })
)

app.listen(3000);
```


You can also `import fuset from '@kiserit/fuset'` if you prefer.



## Options

`path`

A relative or absolute path in which all files in the path will be combined.

`files`

An array of files to combine. These can be relative or absolute paths.

 
`cache`

This is the [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#no-store) header to use when returning the file content. 


`mime`

This is the [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header to use when returning the file content. This will be used exactly as specified, but should be the mime type.


`minifier`

This is a function that takes one string parameter and returns a string. The function will be passed the raw content of the combined files. The result of the function will be used when returning the response content.
