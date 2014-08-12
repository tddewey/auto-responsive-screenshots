/*
* Generate a series of screenshots at different viewport widths based on a file of URLs
*
* Required: A line separated list of URLs to capture screenshots for in a file titled 'urls' in this directory.
*
* Generated screenshots will be in a folder titled screenshots/{date}/
* 
* Usage:
* $ casperjs screenshots.js
*/
 
var casper = require("casper").create();
var fs = require('fs'); /* phantonJS module: https://github.com/ariya/phantomjs/wiki/API-Reference-FileSystem */


// Set up variables
var screenshotUrl = 'http://google.com/',
    screenshotNow = new Date(),
    screenshotDateTime = screenshotNow.getFullYear() + pad(screenshotNow.getMonth() + 1) + pad(screenshotNow.getDate()) + '-' + pad(screenshotNow.getHours()) + pad(screenshotNow.getMinutes()) + pad(screenshotNow.getSeconds()),
     viewports = [
      {
        'name': 'alpha',
        'viewport': {width: 320, height: 2000}
      },
      {
        'name': 'bravo',
        'viewport': {width: 768, height: 2000}
      },
      {
        'name': 'charlie',
        'viewport': {width: 1024, height: 2000}
      },
      {
        'name': 'david',
        'viewport': {width: 1280, height: 2000}
      }
    ];

// Load the casper environment with a dummy URL
casper.start( 'about:config' );


/**
 * Using the PhantomJS filesystem API, load the urls file
 * Iterate through each line and call casper to process.
 */
var urlStream = fs.open( 'urls', 'r');

while( ! urlStream.atEnd() ) {
  var url = urlStream.readLine();
  casper.echo( escapeUrlForDirectory(url));
  //getScreenshots(url);
}

urlStream.close();

casper.run();

/**
 * Gets a series of screenshots for a given URL
 * 
 * @param  string url a URL
 */
function getScreenshots(url) {

  casper.each(viewports, function(casper, viewport) {
    this.then(function() {
      this.viewport(viewport.viewport.width, viewport.viewport.height);
    });
    this.thenOpen(url, wait( this ));
    this.then(function(){
      var screenshotPath = 'screenshots/' + screenshotDateTime + '/' + escapeUrlForDirectory(url) + '-' + viewport.viewport.width + 'x' + viewport.viewport.height + '.png';
      this.echo('Screenshot for ' + url + ' (' + viewport.viewport.width + 'x' + viewport.viewport.height + ')', 'info');
      // this.capture(screenshotPath, {
      //     top: 0,
      //     left: 0,
      //     width: viewport.viewport.width,
      //     height: viewport.viewport.height
      // });
      this.captureSelector(screenshotPath, 'html');
    });
  });
}
 
/**
 * Pad dates so they are consistent
 * @param  integer number
 * @return integer padded integer
 */
function pad(number) {
  var r = String(number);
  if ( r.length === 1 ) {
    r = '0' + r;
  }
  return r;
}

/**
 * Offload the casper wait function so we aren't creating a ton of needless anonymous functions
 * @param  object casper
 */
function wait(casper) {
  casper.wait(5000);
}

/**
 * Remove slashes and a leading http:// from URls so they are suitable for filenames
 * @param string str
 * @return string escaped string
 */
function escapeUrlForDirectory(str) {
  return str.replace(/^http[s]?:\/\/(?:w{3}.)?/,'').replace( /\//g, '-').replace(/-$/,'');
}
