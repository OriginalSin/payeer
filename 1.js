var h = {};
var maxTime = 0;
var delta = 5;

var parseArr = function(arr){
	for(var i=0; i<arr.length; i+=4) {
		var dt = arr[i].split(':');
		var minutes = Math.floor(dt[1] / delta);
		var tm = Number(dt[0]) + delta * minutes / 100;
		var timeKey = Number(arr[i].replace(':','.'));
		if (timeKey <= maxTime) continue;
		var hh = h[tm] || {s:0, n:0};
		h[tm] = {
			s: hh.s + Number(arr[i+2].replace(',','')),
			n: hh.n + Number(arr[i+3].replace(',',''))
		};
	};
	//console.log(h);
	for(t in h){
		if (t <= maxTime) continue;
		h[t].s = h[t].s/h[t].n;
	};
	console.log(h);
	var m = Object.keys(h).sort();
	maxTime = m[m.length-1];
	//console.log(m);
	console.log(m.map((key) => h[key].s));
	var mm = m.map((key, ind) => {
		if (ind) {
			return h[key].s / h[m[ind-1]].s;
		}
		else {
			return 1;
		}
	} );
	console.log(mm);

	var GreenRed = mm.map((i,ind) => {return (ind && mm[ind-1]>1) ? "green": "red"});
	console.log(GreenRed);

	var balance = 100;
	for(i=2; i<mm.length; i++){
		if (mm[i-1]>1)	balance *= mm[i];
	};
	console.log('balance', balance);

	var optBalance = 100;
	for(i=1; i<mm.length; i++){
		if (mm[i]>1)	optBalance *= mm[i];
	};
	console.log('optimal balance', optBalance);

};

var getArr = function(){
	let arr = document.getElementsByClassName('trade-management__history-main-items')[0].innerText.split('\n');
	// отфильтровать arr, оставив только новые метки времени
	parseArr(arr);
};

setInterval(getArr, 1000*60);
getArr()