var program = require('commander');
var Transform  = require('stream').Transform;
var fs = require('fs');
var util = require('util');


// Read in the inuptStream here
var inputStream = fs.createReadStream('input-sensor.txt');

//For Node 0.8 users 
if(!Transform) {
    Transform = require('readable-stream/transform'); 
}

// This is the where call the Pattern Match Function
function PatternMatch(patterns) {
    Transform.call(this, { objectMode: true });
    this.pattern = patterns;
}

// Inheriting the functions: PatternMatch Transform
util.inherits(PatternMatch, Transform);

program
    .option('-p, --pattern <pattern>', 'Input Patterns such as . ,') 
    .parse(process.argv);

var patternStream = inputStream.pipe(new PatternMatch(program.pattern)); 
patternStream.on('readable', function() { 
        var eachLine = this.read(); 
            console.log(eachLine.toString()); 
    }); 

PatternMatch.prototype._transform = function(chunk, encoding, getNextChunk) { 
    var text = chunk.toString();
    this.push(''); 
    this.push('-----------------------------------INPUT---------------------------------');
    this.push(''); 
    this.push(text); 
    this.push('');
   // Split the text with the pattern entered in the Command Line
    var arrayOfLines = text.split(this.pattern)
    
    arrayOfLines.splice(arrayOfLines.length-1, 1);
    this.push('');
    this.push("----------------------------------OUTPUT---------------------------------"); 
    this.push('');


Array.prototype.each = function() {/*Function for the Array*/};
 
for (var index in arrayOfLines) {
    if (arrayOfLines.hasOwnProperty(index)) {
    // if it is ther first line
     if(index == 0) {
            this.push("[ " + "'" + arrayOfLines[index] + "'" + ",");
        }
   // if it is the last line 
    if(index == arrayOfLines.length - 1){
            this.push("'" + arrayOfLines[index].slice(1) + "'" + " ]");
        }
   // If it is a regular line
	if(index!=0 && index!=arrayOfLines.length - 1){
           this.push("'" + arrayOfLines[index].slice(1) + "'" + ",");
        }
    }
}   
this.push('');
    getNextChunk();  
}

PatternMatch.prototype._flush = function(flushDone) {

}
