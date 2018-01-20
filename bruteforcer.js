'use strict';

function Bruteforcer(cfg)
{
	this.min = cfg.min || 1;
	this.max = cfg.max || 1;
	this.cbk = cfg.cbk || ( (s,i,c) => { return true } );
	this.chars  = [];
	this.caseIdx = 0;
	this.cases = 0;
	this.curSeq = 0;
	this.seqChg = true;
	this.stopped = false;

	let c = cfg.chars;
	if (typeof c === 'string')
	{
		this.chars.push(c.split(''));
	}
	else if (isArray(c))
	{
		let elem = c[0];

		if (typeof elem === 'string')
		{
			c.map( (elem) => { this.chars.push(elem.split('')); } );
		}
	}

	// calculate total number of all cases
	c = this.chars;
	let cnt = c.length;
	this.min = Math.max(cnt, this.min); // each charset appear at lease once
	this.curLen = this.min;
	this.seqsInfo = {};
	this.candidate = new Array(cnt);

	for (let len=this.min; len<=this.max; len++)
	{
		let seqs = getNumSeqWithSum(len, cnt);

		let seqsInfo = { accCases: 0, info: [] };
		this.seqsInfo[len] = seqsInfo;

		for (let seq of seqs)
		{
			let cases = 1;
			let seqInfo = { accCases: 0, seq: seq, gfuncs: [] };

			for (let idx in c)
			{
				seqInfo.gfuncs.push(genCharSeq(c[idx], seq[idx]));

				cases *= Math.pow(c[idx].length, seq[idx]);
			}

			this.cases += cases;
			seqInfo.accCases = this.cases;

			seqsInfo.info.push(seqInfo);
		}

		seqsInfo.accCases = this.cases;
	}
}

Bruteforcer.prototype.start = function()
{
	if (this.cases <= this.caseIdx)
	{
		return;
	}

	let seqsInfo = this.seqsInfo[this.curLen];
	let seqInfo = seqsInfo.info[this.curSeq];
	let gfuncs = seqInfo.gfuncs;
	let seq = seqInfo.seq;
	let c = this.chars;
	let cnt = c.length;
	let candidate = this.candidate;

	if (this.seqChg)
	{
		this.seqChg = false;

		for (let idx=cnt-2; 0<=idx; idx--)
		{
			candidate[idx] = gfuncs[idx].next().value;
		}
	}

	for (let idx=cnt-1; 0<=idx; idx--)
	{
		let nxtRes = gfuncs[idx].next();

		if (!nxtRes.done)
		{
			candidate[idx] = nxtRes.value;
			break;
		}

		gfuncs[idx] = genCharSeq(c[idx], seq[idx]);
		candidate[idx] = gfuncs[idx].next().value;
	}

	if (this.cbk(candidate.join(''), this.caseIdx, this.cases))
	{
		return;
	}

	if (this.stopped)
	{
		return;
	}

	this.caseIdx++;
	if (seqInfo.accCases <= this.caseIdx)
	{
		this.curSeq++;
		this.seqChg = true;

		if (seqsInfo.accCases <= this.caseIdx)
		{
			this.curLen++;
			this.curSeq = 0;
		}
	}

	setImmediate( () => { this.start.call(this) } );
};

Bruteforcer.prototype.startFrom = function(caseIdx)
{
	if (this.cases <= caseIdx)
	{
		return;
	}

	// started before this call
	if (caseIdx < this.caseIdx)
	{
		return;
	}

	this.curLen = this.min;
	this.curSeq = 0;
	let seqChg = false;
	for (let len=this.min; len<=this.max; len++)
	{
		let seqsInfo = this.seqsInfo[len];

		if (seqsInfo.accCases <= caseIdx)
		{
			continue;
		}

		this.curLen = len;

		let cases = 0;
		for (let seqInfo of seqsInfo.info)
		{
			if (seqInfo.accCases <= caseIdx)
			{
				cases = seqInfo.accCases;
				this.curSeq++;
				continue;
			}

			if (cases == caseIdx)
			{
				seqChg = true;
				break;
			}

			let c = this.chars;
			let cnt = c.length;
			let seq = seqInfo.seq;
			let gfuncs = seqInfo.gfuncs;
			let candidate = this.candidate;

			for (let idx=cnt-2; 0<=idx; idx--)
			{
				candidate[idx] = gfuncs[idx].next().value;
			}
			
			// todo: genCharSeq supports generating from specified index and we may utilize this.
			while (cases < caseIdx)
			{
				for (let idx=cnt-1; 0<=idx; idx--)
				{
					let nxtRes = gfuncs[idx].next();

					if (!nxtRes.done)
					{
						candidate[idx] = nxtRes.value;
						break;
					}

					gfuncs[idx] = genCharSeq(c[idx], seq[idx]);
					candidate[idx] = gfuncs[idx].next().value;
				}

				cases++;
			}

			break;
		}

		break;
	}

	this.caseIdx = caseIdx;
	this.seqChg = seqChg;
	this.stopped = false;

	setImmediate( () => { this.start.call(this) } );
}

Bruteforcer.prototype.stop = function()
{
	this.stopped = true;
}

Bruteforcer.prototype.setCallback = function(cbk)
{
	if (typeof cbk === 'function')
	{
		this.cbk = cbk;
	}
}

Bruteforcer.prototype.getCaseIndex = function()
{
	return this.caseIdx;
}

Bruteforcer.prototype.getCaseNumber = function()
{
	return this.cases;
}

function isArray(o)
{
	return Object.prototype.toString.call(o) === '[object Array]';
}

function getNumSeqWithSum(sum, cnt)
{
	function helper(sum, cnt, prfx, seqs)
	{
		if (0>=sum || 0>=cnt)
		{
			return ;
		}

		if (1==cnt)
		{
			prfx.push(sum);
			seqs.push(prfx.concat([]));	// shallow copy prfx
			prfx.pop();

			return;
		}

		for (let i=1; i<sum; i++)
		{
			prfx.push(i)
			helper(sum-i, cnt-1, prfx, seqs);
			prfx.pop();
		}
	}

	let seqs = [];
	helper(sum, cnt, [], seqs);

	return seqs;
}

function* genCharSeq(chars, len, start)
{
	let arr = new Array(len);
	let idx = 0;
	let charCnt = chars.length;
	let cases = Math.pow(charCnt, len);

	// start is optional, used for recover case
	start = start || 0;
	if (start >= cases)
	{
		return '';
	}

	let cnt=start;

	for (idx=len-1; 0<=idx; idx--)
	{
		arr[idx] = start % charCnt;

		start = parseInt(start/charCnt);
	}

	function toString(charSeqArr, chars)
	{
		return charSeqArr.map((idx) => chars[idx]).join('');
	}

	while (cnt<cases)
	{
		cnt++;
		yield toString(arr, chars);

		for (idx=len-1; 0<=idx; idx--)
		{
			arr[idx]++;

			if (arr[idx] != charCnt)
			{
				break;
			}
			
			arr[idx] = 0;
		}
	}

	return '';
}

module.exports = Bruteforcer;