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
var sAsk = {}, sBid = {};
function gAskBid(){
		var changed = false;
		var newAsk = {};
		// получить порцию из 50 цен Ask верхнего стакана
		var t1 = new Date().valueOf();
		var lastAsk = document.getElementsByClassName("trade-management__main-items")[0].children;
		var nAsk = lastAsk.length;
		for(var i=1; i<nAsk-2; i++){
			iAsk = lastAsk[i];
			newAsk[iAsk.getAttribute("data-price")] = Number(iAsk.getAttribute("data-amount"));
		};
		for(var price in sAsk){											// в цикле по всем ценам Ask истории стакана
			var sAmount = sAsk[price];
			var sAmounts = sAmount.length;
			var sLastAmount = sAmount[sAmounts-1];
			var newAmount = newAsk[price];
			if(newAmount){												// цена присутствует в новом состоянии стакана
				if(newAmount != sLastAmount[0]){
					changed = true;
					console.log("Ask", t1, price, sLastAmount[0], "=>", newAmount);
					sAmount.push([newAmount, t1]); 			// количество изменилось, добавляем его с отметкой времени
				}
			}
			else if(sLastAmount[0]){									// цена в истории имеет ненулевое количесво, но ее нет в новом состоянии стакана
				changed = true;
				console.log("Ask", t1, price, sLastAmount[0], "=>",0);
				sAmount.push([0, t1]);								// ставим нулевое количество с отметкой времени
			};
		};
		for(var newPrice in newAsk){								// в цикле по ценам нового состояния стакана
			if(! sAsk[newPrice]){										// если такой цены в стакане раньше не было
				changed = true;
				console.log("Ask", t1, newPrice, 0,"=>", newAsk[newPrice]);
				sAsk[newPrice] = [[newAsk[newPrice], t1]];	// добавляем эту цену в историю стакана с меткой времени
			}
		};
		// получить порцию из 50 цен Bid нижнего стакана
		var newBid = {};
		var t2 = new Date().valueOf();
		var lastBid = document.getElementsByClassName("marked-list trade-sell-orders")[0].children[0].children;
		var nBid = lastBid.length;
		for(var i=0; i<nBid-1; i++){
			iBid = lastBid[i];
			newBid[iBid.getAttribute("data-price")] = Number(iBid.getAttribute("data-amount"));
		};
		for(var price in sBid){											// в цикле по всем ценам Bid истории стакана
			var sAmount = sBid[price];
			var sAmounts = sAmount.length;
			var sLastAmount = sAmount[sAmounts-1];
			var newAmount = newBid[price];
			if(newAmount){												// цена присутствует в новом состоянии стакана
				if(newAmount != sLastAmount[0]){
					changed = true;
					console.log("Bid", t2, price, sLastAmount[0], "=>", newAmount);
					sAmount.push([newAmount, t1]); 			// количество изменилось, добавляем его с отметкой времени
				}
			}
			else if(sLastAmount[0]){									// цена в истории имеет ненулевое количесво, но ее нет в новом состоянии стакана
				changed = true;
				console.log("Bid", t2, price, sLastAmount[0], "=>",0);
				sAmount.push([0, t1]);								// ставим нулевое количество с отметкой времени
			};
		};
		for(var newPrice in newBid){								// в цикле по ценам нового состояния стакана
			if(! sBid[newPrice]){										// если такой цены в стакане раньше не было
				changed = true;
				console.log("Bid", t2, newPrice, 0,"=>", newBid[newPrice]);
				sBid[newPrice] = [[newBid[newPrice], t1]];	// добавляем эту цену в историю стакана с меткой времени
			}
		};
		if (changed){
			var t3 = new Date().valueOf();
			console.log("время",t3-t1,"мсек", Object.keys(sAsk).length,"цен Ask", Object.keys(sBid).length,"цен Bid");
		};
}
function cAskBid(){
	// повторить с интервалом 1 секунда
	let timerId = setInterval(gAskBid, 1000);
	// остановить вывод через 2 минуты
	setTimeout(() => { clearInterval(timerId); console.log(sAsk, sBid); }, 120000);
};
cAskBid();