'use strict';

let Bruteforcer = require('./bruteforcer.js');
let caseIndex = [ 160,161, 773,774, 1259,1260, 4121,4122, 4264 ];
let chkIdx = 0;
let chkCnt = caseIndex.length;

let bf = new Bruteforcer({
	chars: ['+~','abc','123'],
	min: 5,
	max: 6,
	cbk: (s,i,c) => {
		console.log('str:',s,'idx:',i,'cases:',c);

		if (i == caseIndex[chkIdx])
		{
			let nxtIdx = caseIndex[chkIdx]+1;

			if (chkIdx+1 < chkCnt)
			{
				chkIdx++;
			}

			console.log('\nStart from caseIndex', nxtIdx, 'and stop at', caseIndex[chkIdx]);
			setImmediate( () => { bf.startFrom(nxtIdx) } );

			return true;
		}
		else
		{
			return false;
		}
	}
});

console.log('Start from the beginning and stop at', caseIndex[chkIdx]);
bf.start();
