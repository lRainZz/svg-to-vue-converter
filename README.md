# SVG to Vue Component Converter

## About
Small CLI tool to convert SVG files to Vue components for easier use in
VueJs applications. Replaces values of stroke/fill properties that are not 'none'
with 'currentColor' (inside style and standalone), 
so the icons can be used with the 'color' CSS property.
  
Uses [prettier](https://www.npmjs.com/package/prettier) to auto format the components.
Currently uses 4 spaces identation.

## Installation
This package is intended to be used on the cli, to use it without any project, run  
`npm i -g svg-to-vue-converter`  
  
For usage see `svg-to-vue-converter -h` or help text below

## man

```
NAME
    svg-to-vue-converter

SYNOPSIS
    svg-to-vue-converter [OPTIONS]...

DESCRIPTION:
    Converts SVGs' to vue components and replaces 'fill' and 'stroke' porperties
    with 'currentColor' for an easier use in vue projects. Does not work well with
    multicolor SVGs'! By Default it takes the SVGs' in the current folder and replaces
    them with its' generated Vue counterparts -> SVGs' will be backed up.

    -h, --help
        display this help

    -i, --input-directory [PATH]
        directory to take the SVGs' from,
        defaults to the current directory '.'
    
    -o, --output-directory [PATH]
        directory to store the generated Vue components,
        defaults to the current directory '.',
        an 'svg' backup folder will be created inside the output folder

    -p, --print-as-is
        omits the formatting with prettier of the created component,
        still wraps the svg in a <template> tag and does some simple whitespace
        sanitization

    -t, --tab-size [NUMBER_OF_SPACES]
        sets the number of spaces used for the indentation of the component,
        defaults to 4

    -k, --keep-color
        disables fill/stroke property value replacements
```