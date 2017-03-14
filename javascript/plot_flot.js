

var data = buildExampleData(2000,1000,20,10,0.3)
var X = data[0]
var Y = data[1]

var full = [];

var xf = X.flatten();
var yf = Y.flatten();

for (var i = 0; i < xf.length; i++) {
	full.push([xf[i],yf[i]]);
}

var tester = $("#tester");

tester.bind("plotselected", function (event, ranges) {
	var r1 = Number(ranges.xaxis.from.toFixed(1));
	var r2 = Number(ranges.xaxis.to.toFixed(1));
	var indexOfStartValue = xf.reduce((iMin, x, i, arr) => Math.abs(x-r1) < Math.abs(arr[iMin]-r1) ? i : iMin, 0);
	var indexOfStopValue = xf.reduce((iMin, x, i, arr) => Math.abs(x-r2) < Math.abs(arr[iMin]-r2) ? i : iMin, 0);

	var xs = xf.slice(indexOfStartValue, indexOfStopValue)
	var ys = yf.slice(indexOfStartValue, indexOfStopValue)

	var yMaxPos = ys.reduce((yMaxI, y, i, arr) => y > arr[yMaxI] ? i : yMaxI, 0) + indexOfStartValue;
	var w = (xf[indexOfStopValue] - xf[indexOfStartValue])/2;
	var area = ys.reduce((a,b) => a+b,0)
	console.log("max pos " + yMaxPos)

	var XS = new Matrixs([xs]).transpose();
	var YS = new Matrixs([ys]).transpose();

	var guess = [xf[yMaxPos],w,area];
	console.log("Guess " + guess)
	var testModel = new nls(guess); 
	var inputObj ={input: XS.value , output: YS.value };
	var resultObj = Solvers.levenbergMarquardt(inputObj,testModel);

	console.log(resultObj.solution);
	console.log("selection mode " + myPlot.getOptions().selection.mode);
	var Y2 = Matrixs.make((new nls(resultObj.solution)).fnc(XS))

	var full1 = [];

	var xf1 = XS.flatten();
	var yf1 = Y2.flatten();

	for (var i = 0; i < xf1.length; i++) {
		full1.push([xf1[i],yf1[i]]);
	}
	myPlot.setData([full, full1]);
	myPlot.clearSelection();
	myPlot.draw()

});

var options = {
	selection: {
		mode: "xy"
	}
};

var myPlot = $.plot(tester, [full], options);

function toggleFitting(){
	myPlot.clearSelection();
	var df = $("#do_fit");
	var mode = df[0].checked ? "x" : "xy"
	myPlot.getOptions().selection.mode = mode
}
	