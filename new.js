/*
var USD = 100, BTC = 0, wasBid, cBuy = 1.005, cTakeProfit = 1.02, cStopLoss = 0.98;
function act(){
	var lastAsk = document.getElementsByClassName("trade-management__main-items")[0].children;
	var Ask = Number(lastAsk[lastAsk.length-3].getAttribute("data-price"));
	var lastBid = document.getElementsByClassName("marked-list trade-sell-orders")[0].children[0].children[0];
	var Bid = Number(lastBid.getAttribute("data-price"));
	console.log("на входе", Ask, Bid, USD, BTC, wasBid);
	if (BTC){
		if(Bid > cTakeProfit * wasBid || Bid < cStopLoss * wasBid){
			USD = BTC * Bid / wasBid;
			BTC = 0;
			console.log("выходим из крипты", USD, BTC, wasBid);
		}
		else {console.log("остаемся в крипте - цена",Bid,"в диапазоне от ", cStopLoss * wasBid, " до ", cTakeProfit * wasBid)};
	}
	else if(wasBid){
		if(Bid > cBuy * wasBid){
			BTC = USD / Ask;
			USD = USD * Bid / Ask;
			console.log("покупаем крипту", USD, BTC, wasBid);
		}
		else {console.log("пока крипту не покупаем - цена",Bid,"не выросла до ", cBuy * wasBid)};
	};
	wasBid = Bid;
};
var AskBid = []; // массив Ask, Bid стакана
var timeStamp = 0;
function getAskBid(){
	timeStamp = timeStamp + 10;
	var lastAsk = document.getElementsByClassName("trade-management__main-items")[0].children;
	var Ask = Number(lastAsk[lastAsk.length-3].getAttribute("data-price"));
	var lastBid = document.getElementsByClassName("marked-list trade-sell-orders")[0].children[0].children[0];
	var Bid = Number(lastBid.getAttribute("data-price"));
	//console.log("на входе", Ask, Bid);
	var nAskBid = AskBid.length;
	if(!nAskBid || AskBid[nAskBid-1][1] != Ask || AskBid[nAskBid-1][2] != Bid)	{
		AskBid.push([timeStamp, Ask, Bid]);
		console.log(AskBid.length, timeStamp, Ask, Bid);
	};
};
//setInterval(getAskBid, 1000*10); // проверяем с интервалом в 10 секунд (записываем только если есть изменения в Ask или Bid)

// Метод valueOf() возвращает примитивное значение объекта Date в виде числового типа данных — количества миллисекунд, прошедших с полуночи 01 января 1970 по UTC.
// new Date().valueOf()
// 1611107828592
let sAsk = {}, sBid = {}, t0, n = 0, d=10000, d0 = 100000;
function gAskBid(){
	//for(let k=0; k<n; k++){
		let k = 0;
		let changed = false;
		let newAsk = {};
		// получить порцию из 50 цен Ask верхнего стакана
		let t1 = new Date().valueOf();
		let lastAsk = document.getElementsByClassName("trade-management__main-items")[0].children;
		let nAsk = lastAsk.length;
		for(let i=1; i<nAsk-2; i++){
			iAsk = lastAsk[i];
			newAsk[iAsk.getAttribute("data-price")] = Number(iAsk.getAttribute("data-amount"));
		};
		for(let price in sAsk){											// в цикле по всем ценам Ask истории стакана
			let nprice = Number(price);
			let sAmount = sAsk[price];
			let sAmounts = sAmount.length;
			let sLastAmount = sAmount[sAmounts-1];
			let newAmount = newAsk[price];
			if(newAmount){												// цена присутствует в новом состоянии стакана
				if(newAmount != sLastAmount[0]){
					changed = true;
					console.log("Ask", (t1-t0+(k%d)/d).toFixed(4), nprice.toFixed(2), sLastAmount[0].toFixed(8), "=>", newAmount.toFixed(8));
					sAmount.push([newAmount, t1-t0+(k%d)/d]); 			// количество изменилось, добавляем его с отметкой времени
				}
			}
			else if(sLastAmount[0]){									// цена в истории имеет ненулевое количество, но ее нет в новом состоянии стакана
				changed = true;
				console.log("Ask", (t1-t0+(k%d)/d).toFixed(4), nprice.toFixed(2), sLastAmount[0].toFixed(8), "=>",0);
				sAmount.push([0, t1-t0+(k%d)/d]);								// ставим нулевое количество с отметкой времени
			};
		};
		for(let newPrice in newAsk){								// в цикле по ценам нового состояния стакана
			let nnprice = Number(newPrice);
			if(! sAsk[newPrice]){										// если такой цены в стакане раньше не было
				changed = true;
				console.log("Ask", (t1-t0+(k%d)/d).toFixed(4), nnprice.toFixed(2), 0,"=>", newAsk[newPrice].toFixed(8));
				sAsk[newPrice] = [[newAsk[newPrice], t1-t0+(k%d)/d]];	// добавляем эту цену в историю стакана с меткой времени
			}
		};
		// получить порцию из 50 цен Bid нижнего стакана
		let newBid = {};
		let t2 = new Date().valueOf();
		let lastBid = document.getElementsByClassName("marked-list trade-sell-orders")[0].children[0].children;
		let nBid = lastBid.length;
		for(let i=0; i<nBid-1; i++){
			iBid = lastBid[i];
			newBid[iBid.getAttribute("data-price")] = Number(iBid.getAttribute("data-amount"));
		};
		for(let price in sBid){											// в цикле по всем ценам Bid истории стакана
			let nprice = Number(price);
			let sAmount = sBid[price];
			let sAmounts = sAmount.length;
			let sLastAmount = sAmount[sAmounts-1];
			let newAmount = newBid[price];
			if(newAmount){												// цена присутствует в новом состоянии стакана
				if(newAmount != sLastAmount[0]){
					changed = true;
					console.log("Bid", (t2-t0+(k%d)/d).toFixed(4), nprice.toFixed(2), sLastAmount[0].toFixed(8), "=>", newAmount.toFixed(8));
					sAmount.push([newAmount, t2-t0+(k%d)/d]); 			// количество изменилось, добавляем его с отметкой времени
				}
			}
			else if(sLastAmount[0]){									// цена в истории имеет ненулевое количество, но ее нет в новом состоянии стакана
				changed = true;
				console.log("Bid", (t2-t0+(k%d)/d).toFixed(4), nprice.toFixed(2), sLastAmount[0].toFixed(8), "=>",0);
				sAmount.push([0, t2-t0+(k%d)/d]);								// ставим нулевое количество с отметкой времени
			};
		};
		for(let newPrice in newBid){								// в цикле по ценам нового состояния стакана
			let nnprice = Number(newPrice);
			if(! sBid[newPrice]){										// если такой цены в стакане раньше не было
				changed = true;
				console.log("Bid", (t2-t0+(k%d)/d).toFixed(4), nnprice.toFixed(2), 0,"=>", newBid[newPrice].toFixed(8));
				sBid[newPrice] = [[newBid[newPrice], t2-t0+(k%d)/d]];	// добавляем эту цену в историю стакана с меткой времени
			}
		};
		if (changed){// || k%d0==0){
			let t3 = new Date().valueOf();
			console.log("от начала", (100*k/n).toFixed(2), "%", ((t3-t0)/1000).toFixed(0),"сек : время",t3-t1+(k%d)/d,"мсек", Object.keys(sAsk).length,"цен Ask", Object.keys(sBid).length,"цен Bid");
		};
	//};
	//console.log("finish");
};
//gAskBid()
function cAskBid(){
	//let t0 = new Date().valueOf();
	// повторить с интервалом 1 секунда
	let timerId = setInterval(gAskBid, 200);
	// остановить вывод через 20 минут
	setTimeout(() => { clearInterval(timerId); console.log(sAsk, sBid); }, 240000);
};
cAskBid();
*/

var asks = {};
function gAsks(){
	var newAsk = {};
	// получить порцию из 50 цен Ask верхнего стакана
	var t1 = new Date().valueOf();
	var lastAsk = document.getElementsByClassName("trade-management__main-items")[0].children;
	var nAsk = lastAsk.length;
	for(var i=1; i<nAsk-2; i++){
		iAsk = lastAsk[i];
		newAsk[iAsk.getAttribute("data-price")] = Number(iAsk.getAttribute("data-amount"));
	};
	for(var it in newAsk){
		if(asks[it]){
			maxt = Number(Object.keys(asks[it]).sort().reverse()[0]);
			if(asks[it][maxt] != newAsk[it]){
				if(maxt==t1){
					console.log(it, maxt,"изменение количества", asks[it][maxt], newAsk[it]);
					asks[it][maxt] = newAsk[it];
				}
				else {
					console.log(it, t1,"добавление времени и количества");
					asks[it][t1] = newAsk[it];
				};
			};
		}
		else {
			asks[it] = {};
			console.log(it,  t1,"создание времени и количества");
			asks[it][t1] = newAsk[it];
		};
	}
};
gAsks(); asks;

var bids = {};
function gBids(){
	var newBid = {};
	// получить порцию из 50 цен Bid нижнего стакана
	var t1 = new Date().valueOf();
	let lastBid = document.getElementsByClassName("marked-list trade-sell-orders")[0].children[0].children;
	let nBid = lastBid.length;
	for(let i=0; i<nBid-1; i++){
		iBid = lastBid[i];
		newBid[iBid.getAttribute("data-price")] = Number(iBid.getAttribute("data-amount"));
	};
	for(var it in newBid){
		if(bids[it]){
			maxt = Number(Object.keys(bids[it]).sort().reverse()[0]);
			if(bids[it][maxt] != newBid[it]){
				if(maxt==t1){
					console.log(it, maxt,"изменение количества", bids[it][maxt], newBid[it]);
					bids[it][maxt] = newBid[it];
				}
				else {
					console.log(it, t1,"добавление времени и количества");
					bids[it][t1] = newBid[it];
				};
			};
		}
		else {
			bids[it] = {};
			console.log(it,  t1,"создание времени и количества");
			bids[it][t1] = newBid[it];
		};
	}
};
gBids(); bids;

var deals = [];
var gDeals = function(){
	let nodeArray = document.getElementsByClassName('trade-management__history-main-items');
	node0 = nodeArray[0];
	var children = node0.children[0].children;
	var len = children.length-1;
	text = node0.innerText;
	arr2 = text.split('\n');
	shot = [];
	for(var i=0; i<len; i++){
		var i4 = 4*i;
		var el = children[i];
		var elSell = el.classList.contains('trade-type-sell');

		var dt = arr2[i4].split(':');
		//var minutes = Math.floor(dt[1] / delta);
		//var tm = Number(dt[0]) + delta * minutes / 100;
		//var timeKey = Number(arr[i].replace(':','.'));

		shot.push([arr2[i4], arr2[i4+1].replace(',',''), Number(arr2[i4+2].replace(',','')), Number(arr2[i4+3].replace(',','')), elSell?"sell":"buy"].join('+'));
	};
	//console.log(shot, deals);
	for(var i=0; i<len; i++){
		if(shot.slice(i,len).join()==deals.slice(0,len-i).join()) break;
	};
	//console.log(i, shot, deals);
	deals = shot.slice(0,i).concat(deals);
	//console.log(i, shot.length, deals.length);
	//return deals;
};
gDeals();

/*
получение данных выполняется примерно за 0.0004 мсек, т.е. за 1 мсек можно получить данные 2500 раз
for(n=10000; n< 10000*200; n = n + 10000){
t0 = new Date().valueOf();
for(var i=0;i<n;i++) lastAsk = document.getElementsByClassName("trade-management__main-items")[0].children;
t1 = new Date().valueOf();
console.log(n, ((t1-t0)/n).toFixed(10),"мсек");
}
*/

/*
n=1000;
var s0 = {}, Ask0 = document.getElementsByClassName("trade-management__main-items")[0].children;
for (var i0=1;i0<51;i0++) s0[Ask0[i0].getAttribute("data-price")]=Ask0[i0].getAttribute("data-amount")
for(var k=0;k<n;k++){
 var s = [], Ask = document.getElementsByClassName("trade-management__main-items")[0].children;
for (var i=1;i<51;i++) s[Ask[i].getAttribute("data-price")]=Ask[i].getAttribute("data-amount")
var eq = true; for(it in s) eq = eq && s[it]==s0[it];
 if(!eq){
 console.log(k);
 s0=s;
 };
};
console.log("finish");
*/