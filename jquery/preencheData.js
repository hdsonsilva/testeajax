function preencheData(palavra,campo,event){
	//Não computa barras
	var tam = palavra.length;
	if(event.keyCode == 111){
		form.elements[campo].value = palavra.substring(0,tam-1);
		palavra = form.elements[campo].value;
	}
	else if((palavra.length == 6 || palavra.length == 3) && palavra.substring(palavra.length-1,palavra.length) != "/"){
		form.elements[campo].value = palavra.substring(0,tam-1)+"/"+palavra.substring(tam-1,tam);
		palavra = form.elements[campo].value;
	}
	//Coloca as barras nos lugares corretos
	if((palavra.length == 2  || palavra.length==5) && event.keyCode != 8){
			form.elements[campo].value = form.elements[campo].value+'/';
	}
	//Coloca barra se até a ultima barra colocada for apagada
}

function formatReal(numero){
                numero = parseFloat(numero);
                decimals=2;  
                sepDecimals=',';
                sepThousand='.';  

                var n = new String(numero.toFixed(decimals)).replace('.','').split('');
                n.reverse();
                var fn = new Array();
                var cont = decimals+1;
                for(e=0;e<n.length;e++){
                    if(e==decimals-1 && n.length>decimals-1){
                        fn.unshift(sepDecimals+n[e]);
                      }
                      else{
                        if(cont--==0 && e != n.length-1){
                          fn.unshift(sepThousand+n[e]);
                          cont = 2;
                        }
                        else fn.unshift(n[e]);
                      } 
                }
                      return fn.join('');
            }
            
    function exibe_msg(msg) {
        if (msg.length > 0) {
            while (msg.indexOf("\\n") >= 0)
                msg = msg.replace("\\n", "\n");
            alert(msg);
        }
    }        