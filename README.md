# Bruteforcer
Enumerating all possible candidates for a problem to find the solution.

## Installation

```bash
$ npm install bruteforcer
```

## Usage

First we create a `Bruteforcer`, giving it characters, length limit and a callback.
After that all we need to do is `start()`.
Check every candidate in the callback and return `true` when the problem is sovled.

```javascript
let Bruteforcer = require('bruteforcer');

let bf = new Bruteforcer({
  chars: 'abc',
  min: 1,
  max: 2,
  cbk: (str, caseIdx, caseNum) => {
    console.log('Trying', str);
    
    if ('ca' == str) {
      console.log('We got it!');
      return true;
    }
    else {
      return false;
    }
  }
});

bf.start();

```

### Options

These are keys in the config object you can pass to the `Bruteforcer` along with.

- `chars` characters(a string or an array of strings) to generate candidates.
- `min` (optional)minimum length of the candidate, default is 1.
- `max` (optional)maximum length of the candidate, default is 1.
- `cbk` (optional) a callback to check every candidate. It is called with three parameters: candidate, caseIndex and caseNum. Return "true" to stop the enumerating.

## Note
When passing the `chars` option with an array of strings, it means that you want to generate the candidate using each charset in the array **orderly** and **at least once**.

```javascript
new Bruteforcer({
  chars: ['abc', '123'],
  min: 3,
  max: 3,
  cbk: chkResult
  });

// "ab3" is a candidate
// "31a" is not a candidate
// "123" is not a candidate
// "abc" is not a candidate
```

## API
Following APIs are provided as well:
### startFrom(caseIndex)
To start enumerating with specified `caseIndex` which you can get by calling `getCaseIndex()`.  You may use it to restore previous session.
### stop()
Another way to terminate the enumerating.
### setCallback(callback)
Set the callback at a later time.
### getCaseIndex()
Get the current case index among all cases.
### getCaseNumber()
Get the total number of cases.

## License
MIT License.
