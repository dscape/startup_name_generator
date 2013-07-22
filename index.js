#!/usr/bin/env node

var dns = require('dns');
var colors = require('colors');
var funwords = require('./funwords');

process.argv.shift();
process.argv.shift();

wordlist = process.argv.length > 0 ? process.argv : ['pay', 'wallet', 'card'];

console.log('+ '.grey + wordlist.join(', '.yellow));

function remove_vowel(s){ 
  return s.replace(/[aeiou]/gi,'');
};

function capitalise(string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function splitToDomain(string) {
  var parts = string.match(/^(.*)?([a-zA-Z]{2,2})$/);
  parts.shift();
  return parts.join('.');
}

function printAvailable(word, long) {
  var domain = splitToDomain(word);
  var dotcom = word + '.com';
  var dotat = word + '.at';
  var dotio = remove_vowel(word) + '.io';
  var dotat2 = remove_vowel(word) + '.at';

  function printResult(d) {
    return function (err) {
      process.stdout.write(err ? ('✔'.green) : ('✗'.red));
      console.log(' ' + d);
    }
  }

  dns.resolve4(domain, printResult(domain));
  dns.resolve4(dotcom, printResult(dotcom));

  if(!long) {
    dns.resolve4(dotat, printResult(dotat));
    dns.resolve4(dotat2, printResult(dotat));
    dns.resolve4(dotio, printResult(dotio));
  }
}

wordlist.forEach(function (word) {
  printAvailable(word);
  var combos = funwords.reduce(function (ac, fw) {
    var first = word + capitalise(fw);
    var last = fw + capitalise(word);

    printAvailable(first);
    printAvailable(last);

    ac.push(first);
    ac.push(last);

    return ac;
  }, []);
});