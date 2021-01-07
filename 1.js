var h = {"sell": {}, "buy": {}};
var maxTime = 0;
var delta = 10;
var ind = -1, indPrev = -1, lastBal = [100,0,100], priceSell = 1, priceSellPrev, priceBuy = 1;

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
	var msell = Object.keys(h.sell).sort();
	var msell2 = msell[msell.length-1];
	priceSellPrev = priceSell;
	priceSell = Number(h.sell[msell2].s.toFixed(2));
	var node = document.forms[1].elements.price;
	console.log(priceSell, node.value, mas.sell[mas.sell.length-1],GreenRedsell);
	node.value = priceSell;

	var GreenRedbuy = mas["buy"].map((i,ind) => {return (ind && mas["buy"][ind-1]>1) ? "BTC": "USD"});
	var mbuy = Object.keys(h.buy).sort();
	var mbuy2 = mbuy[mbuy.length-1];
	priceBuy = Number(h.buy[mbuy2].s.toFixed(2));
	console.log('Здесь у нас прайсы',priceSellPrev, priceSell, priceBuy);
	node = document.forms[0].elements.price;
	//console.log(priceBuy, node.value, mas.buy[mas.buy.length-1],GreenRedbuy);
	node.value = priceBuy;

	var balance = [[100,0,100,"stay in USD"],[100,0,100,"stay in USD"]];
	var i = mas["sell"].length-1;
	if (i>1){
	//for(i=2; i<mas["sell"].length; i++){
		//var lastBalance = balance[i-1], crypto = 0, USD = 0, action = "";
		if (mas["sell"][i-1]>1)	{ 		// на предыдущем периоде курс рос
			if (mas["sell"][i-2]>1)	{ 	// на предыдущем периоде портфель был в крипте
				//crypto = lastBalance[1]; USD = lastBalance[2]; action = "stay in crypto"; // остаемся в крипто
				ind = -1;
			}
			else {							// на предыдущем периоде портфель был в USD
				//crypto = lastBalance[2] / mbuy[i-1]; USD = 0; action = "buy crypto"; // покупаем крипту
				ind = 0;
			};
		}
		else {								// на предыдущем периоде курс падал
			if (mas["sell"][i-2]>1)	{ 	// на предыдущем периоде портфель был в крипте
												// продаем крипту
				//crypto = 0; USD = lastBalance[1] * msell[i-1]; action = "sell crypto"; // продаем крипту
				ind = 1;
			}
			else {							// на предыдущем периоде портфель был в USD
				//crypto = lastBalance[1]; USD = lastBalance[2]; action = "stay in USD"; // остаемся в USD
				ind = -1;
			};
		};
		//balance.push( [crypto * msell[i] + USD, crypto, USD, action] );
	};
	console.log('balance', balance);

	var optBalance = 100;
	for(i=1; i<mas.sell.length; i++){
		if (mas.sell[i]>1)	optBalance *= mas.sell[i];
	};
	//console.log('optimal balance', optBalance);
	return ind;
};

var submitForm = function(flag) {	// submitForm(0) - Купить Crypto	submitForm(1) - Продать Crypto
	var form = document.forms[flag ? 1 : 0];
	var buttons = form.getElementsByTagName('button');
	var buttonSubm = buttons[4];
	var button100p = buttons[3];
	button100p.click();
	buttonSubm.click();
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
	ind = parseArr(sellbuy);
	if (ind != -1) {
		//submitForm(ind);
		if (ind && lastBal[1]){
			// [800, 30, 0]
			lastBal = [lastBal[1]*priceSell, 0, lastBal[1]*priceSell]; 									// submitForm(1) - Продать Crypto
		}
		else if (lastBal[2]) {
			// [100, 0, 100]
			// 0 undefined 1 NaN (3) [NaN, NaN, 0]
			lastBal = [(lastBal[2] / priceBuy)*priceSell, lastBal[2] / priceBuy, 0]; 	// submitForm(0) - Купить Crypto
		};
	}
	else {
		// если в битках, то баланс пересчитываем
		if (lastBal[1]) {
			// [100000, 30, 0]
			lastBal = [lastBal[1]*priceSell, lastBal[1], 0];
		};
	};
	console.log(ind, priceSellPrev, priceSell, priceBuy, lastBal);
};

setInterval(getArr, 1000*60);
getArr();
