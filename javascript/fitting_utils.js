function gaussian(x, p, w, a) {

	return a * Math.exp(-Math.pow(x-p,2)/(2*Math.pow(w,2)));

}

function gaussianCurried(p,w,a){
	return function(x) {
		return gaussian(x,p,w,a)
	}
}

function nls(param){this.param = param;} // Create Object
    nls.prototype.fnc = function(x) //Create Object's function 
    {
    	var X = Matrixs.make(x);
    	var p = this.param[0];
    	var w = this.param[1];
    	var a = this.param[2];
		var Y = X.apply(gaussianCurried(p,w,a))
		return Y.value;  
}

function buildExampleData(nPoints,p,w,a,noise) {
	var X = Matrixs.range(0,1,nPoints);
	var Y = Matrixs.make((new nls([p,w,a])).fnc(X)).addNoise(noise);
	return [X,Y]
}