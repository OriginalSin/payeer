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