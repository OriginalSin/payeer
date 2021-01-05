var h = {"sell": {}, "buy": {}};
var maxTime = 0;
var delta = 15;

var parseArr = function(arr){
	for(var i=0; i<arr.length; i++) {
		var arri = arr[i];
		var tm = arri[0];
		//var timeKey = arri[1];
		if (tm <= maxTime) continue;
		var key = tm+arri[3];
		var hh = h[arri[3]?"sell":"buy"];
		var hhtm = hh[tm] || {s:0, n:0};
		hh[tm] = {
			s: hhtm.s + arri[2],
			n: hhtm.n + arri[1]
		};
	};
	//console.log(h);
	for(key in h){
		var hkey = h[key];
		for(t in hkey) {
			if (t <= maxTime) continue;
			hkey[t].s = hkey[t].s/hkey[t].n;
		};
	};
	console.log(h);
	var m = Object.keys(h.sell).concat(Object.keys(h.buy)).sort();
	maxTime = m[m.length-1];
	//console.log(m);
	//console.log(m.map((key) => h[key].s));

	var mas = {"sell": [], "buy": []};
	for(var sellbuy in h){
		var hkey = h[sellbuy];
		var ss = Object.keys(hkey).sort();
		mas[sellbuy] = ss.map((key, ind) => {
				if (ind) {
					return hkey[key].s / hkey[ss[ind-1]].s;
				}
				else {
					return 1;
				}
			} 	
		);
	};

	console.log(mas);

	var GreenRedsell = mas.sell.map((i,ind) => {return (ind && mas.sell[ind-1]>1) ? "BTC": "USD"});
	var mx = Object.keys(h.sell).sort();
	var mx2 = mx[mx.length-1];
	console.log(h.sell[mx2].s.toFixed(2), mas.sell[mas.sell.length-1],GreenRedsell);
	var GreenRedbuy = mas["buy"].map((i,ind) => {return (ind && mas["buy"][ind-1]>1) ? "BTC": "USD"});
	var mb = Object.keys(h.buy).sort();
	var mb2 = mb[mb.length-1];
	console.log(h.buy[mb2].s.toFixed(2), mas.buy[mas.buy.length-1],GreenRedbuy);

	var balance = 100;
	for(i=2; i<mas["sell"].length; i++){
		if (mas["sell"][i-1]>1)	balance *= mas["sell"][i];
	};
	console.log('balance', balance);

	var optBalance = 100;
	for(i=1; i<mas.sell.length; i++){
		if (mas.sell[i]>1)	optBalance *= mas.sell[i];
	};
	console.log('optimal balance', optBalance);

};

var getArr = function(){
	let nodeArray = document.getElementsByClassName('trade-management__history-main-items');
	node0 = nodeArray[0];
	var children = node0.children[0].children;
	text = node0.innerText;
	arr2 = text.split('\n');
	sellbuy = [];
	for(var i=0; i<children.length-1; i++){
		var i4 = 4*i;
		var el = children[i];
		var elSell = el.classList.contains('trade-type-sell');

		var dt = arr2[i4].split(':');
		var minutes = Math.floor(dt[1] / delta);
		var tm = Number(dt[0]) + delta * minutes / 100;
		//var timeKey = Number(arr[i].replace(':','.'));

		sellbuy.push([tm, Number(arr2[i4+2].replace(',','')), Number(arr2[i4+3].replace(',','')), elSell]);
	};
	// отфильтровать arr, оставив только новые метки времени
	parseArr(sellbuy);
};

setInterval(getArr, 1000*60);
getArr()