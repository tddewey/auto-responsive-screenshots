# Auto Responsive Screenshots

Uses CasperJS to generate screenshots at a series of common browser sizes for a set of URLs.

Easily used to generate archives. Like, for posterity. To see what something looked like back in the day.

Captures full-length images (specifically, the HTML selector)

The intent here is not cross browser or responsive design testing or even as part of a continuous integration workflow. It's just to get a bunch of one-off screenshots. It uses PhantomJS internally.

## Browser Sizes
These can be tweaked from within app.js, but by default:
* 1280px
* 1024px
* 768px
* 320px

## Requires
This script requires casperJS and, by extension, PhantomJS.

## Running
`casperjs app.js`