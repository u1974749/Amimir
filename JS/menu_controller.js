//Logica del Menú principal


function salir(){
	loadpage("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley");
}

function menu(){
    loadpage("../");
}

//Detectar si hay partida guardada.
{
	var noPartida;
	var json = localStorage.getItem("noPartida");
	if(!(json === null) && !(json === undefined))
	{
		noPartida = JSON.parse(json);
	}	
	else
	{
		noPartida = true;
	}
	if(noPartida == "false") noPartida = false;
	else noPartida = true;
}


var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var noPartida = false;
	var vue_instance = new Vue({
		el: "#menu_background",
		methods: { 			
			cargarPartida: function(){						
				loadpage("./HTML/game.html");	
			},
			nuevaPartida: function(){
				localStorage.setItem("noPartida",JSON.stringify('true'));
				loadpage("./HTML/game.html");
			}
		}
	});
	return {
		// Aquí dins hi ha la part pública de l'objecte
		getOptionsString: function (){
			return JSON.stringify(options_data);
		},
		getNumOfCards: function (){
			return options_data.cards;
		},
		getDificulty: function (){
			return options_data.dificulty;
		}
	}; 
}();

