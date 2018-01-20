'use strict';

let Bruteforcer = require('./bruteforcer.js');
let caseIndex = 1251;
let testCase = 1;

if (2 < process.argv.length)
{
	testCase = process.argv[2];
}

let bf = new Bruteforcer({
	chars: ['+~','abc','123'],
	min: 6,
	max: 6,
	cbk: (s,i,c) => {
		console.log('str:',s,'idx:',i,'cases:',c);
		return (i == caseIndex)? true: false;
	}
});

if (1 == testCase)
{
	console.log('Start from the beginning and stop at', caseIndex);
	bf.start();
}
else if (2 == testCase)
{
	console.log('\nStart from caseIndex', caseIndex+1);
	bf.startFrom(caseIndex+1);
}
