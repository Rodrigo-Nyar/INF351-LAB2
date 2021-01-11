//Verano 2020, INF 351 - LABORATORIO 2
//Desarrollado por Rodrigo Javier Castillo Guzman

document.getElementById("reglasDiv").innerHTML = "Reglas: vacío";
let reglasAdelante = new Map();
let reglasAtras = new Map();
let reglas = new Map();
mostrarReglas();
function calcular(){
	event.preventDefault();
	let hechosText = document.getElementById("hechosText").value;
	let inferirText = document.getElementById("InferirText").value;
	let controlText = document.querySelector('input[name="control"]:checked').value;
	db("calcular",controlText,hechosText,inferirText);
	if(hechosText){
		if(controlText === "adelante"){
			reglas = reglasAdelante;
		}else{
			reglas = reglasAtras;
		}
		db("calcular con reglas:",reglas);
		let hechosInferidos = inferir(mascara(hechosText));
		db("calcular hechos:",hechosInferidos, literal(hechosInferidos));
		let aInferir = mascara(inferirText);
		if(aInferir >0){
			let resultado = "falso";
			if(aInferir === (aInferir&hechosInferidos)){
				resultado = "cierto";
			}
			document.getElementById("ResultadoDiv").innerHTML = 
				"Se infiere: " + 
				literal(hechosInferidos) + 
				", por lo que " + literal(aInferir) + 
				" es " +  resultado;
		}else{
			document.getElementById("ResultadoDiv").innerHTML = 
				"Se infiere: " + 
				literal(hechosInferidos);
		}
		
	}
	
}
function inferir(hechos){
	let oldHechos;
	do{
		oldHechos = hechos;
		for (let [hip, imp] of reglas.entries()){ // regla: hip -> imp
			if( hip === (hip&hechos)){ // si la hipotesis de la regla es parte de los hechos
				hechos |= imp; // agregamos su implicacion como un hecho
			}
		}
	}while(hechos !== oldHechos); //mientras encontremos nuevos hechos
	return hechos;
}
function nuevaRegla(){
	event.preventDefault();
	let hipotesisText = document.getElementById("hiptosisText").value;
	let implicacionText = document.getElementById("implicacionText").value;
	db("nuevaRegla", hipotesisText, implicacionText);
	if(hipotesisText && implicacionText){
		let hipotesis = mascara(hipotesisText);
		let implicacion = mascara(implicacionText);
		addRegla(hipotesis, implicacion);
		mostrarReglas();
	}
}
function nuevasReglas(){
	event.preventDefault();
	let multiplesReglas = document.getElementById("multiplesReglasText").value.split("\n");
	db("nuevasReglas", multiplesReglas);
	let n = multiplesReglas.length;
	for(let i=0;i<n;i++){
		if(multiplesReglas[i]){
			let regla = multiplesReglas[i].split(">");
			let [hipotesisText, implicacionText] = regla;
			if(hipotesisText && implicacionText){
				let hipotesis = mascara(hipotesisText);
				let implicacion = mascara(implicacionText);
				addRegla(hipotesis, implicacion);
				mostrarReglas();
			}
		}
	}
}
function addRegla(hipotesis, implicacion){
	db("addRegla", hipotesis, implicacion)
	if(reglasAdelante.has(hipotesis))
		implicacion |= reglasAdelante.get(hipotesis);
	reglasAdelante.set(hipotesis,implicacion);
	
	if(reglasAtras.has(implicacion))
			hipotesis |= reglasAtras.get(implicacion);
	reglasAtras.set(implicacion,hipotesis);	
}
function mostrarReglas(){
	let reglasHtml = "<b>Reglas:</b><br><br>";
	for (let [key, value] of reglasAdelante.entries()) {
		if(value){
			db("mostrarReglas : ",key, value);
			reglasHtml += literal(key) + ">" + literal(value) + "<br>";
		}
	}
	document.getElementById("reglasDiv").innerHTML = reglasHtml;
}
function literal(mask){//conversion a una máscara de bits
	let literal = "";
	for(let i=0;i<26;i++){
		if(mask&(1<<i))
			if(literal)
				literal += "," + String.fromCharCode(i+65);
			else 
				literal += String.fromCharCode(i+65);
	}
	return literal;
}
function mascara(literal){ // conversión de mascara de bits
	let mask = 0;
	let L = literal.split(",");
	let n = L.length;	
	for(let i=0;i<n;i++){
		if(L[i]){
			let ind = L[i].charCodeAt(0) - 65;			
			if(ind>=0 && ind<26)
				mask |= (1 << ind);
		}		
	}
	return mask;
}
function db(msj,...arguments){
	console.log(msj,arguments);
}