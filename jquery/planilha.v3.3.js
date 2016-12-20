var isNN = (navigator.appName.indexOf('Netscape')!=-1);

function mudaCampoRefinan(e,campo,posicao){
	if(e.keyCode == 38)
		posicao = parseInt(posicao) - 1;
	else if(e.keyCode == 40)
		posicao = parseInt(posicao) + 1;
	if((e.keyCode == 38 || e.keyCode == 40) && posicao > 0)
		form.elements[campo+'['+posicao+']'].select();
}

function repeteAutorizacaoCartao(form,inicio,exec){
	if(!exec && inicio != form.parcela.value && abs(form.parcela.value) > 1 && (form.elements['tipo_rec['+inicio+']'].value == 'ccredito' || form.elements['tipo_rec['+inicio+']'].value == 'cdebito') && form.elements['cheque['+inicio+']'].value != '' )
		aviso('CONFIRME','Deseja completar os documentos seguintes referente à Cartão com esse número?','CONFIRMACAO',"repeteAutorizacaoCartao(form,'"+inicio+"','1')");
	else if(exec)
		for( i = inicio ; i <= abs(form.parcela.value) ; i ++)
				if(form.elements['tipo_rec['+i+']'].value == 'ccredito' || form.elements['tipo_rec['+i+']'].value == 'cdebito')
					form.elements['cheque['+i+']'].value = form.elements['cheque['+inicio+']'].value;
}

function abre_dados_emitente(posicao,tipo,aviso_){
	if(tipo == 'A'){
		document.getElementById('emitentes_dados').style.width = document.body.scrollWidth + 'px';
		document.getElementById('emitentes_dados').style.height =document.body.scrollHeight + 'px';
		document.getElementById('emitentes_dados').style.display = '';
		document.getElementById('emitente_cpf_xx['+posicao+']').focus();
	}
	else{
		if(aviso_ == 'S'){
			//document.getElementById('emitentes_dados').style.display = 'none';
				
				/*Varre os CPF's procurando emitente que possuiu cheque devolvido*/
				document.getElementById('emitentes_dados').style.display = 'none';
		}
		else{
			/*Consulta restriicao no Adx*/
			/*for( i = 1 ; i <= abs(form.parcela.value) ; i++ ){
					chequesRestricao[i] = 'NAO' ;
					x_consulta_restricao(banco_Adx,form.elements["cpf_emitente["+i+"]"].value, i ,retornaCpfRestricao);
			}*/
			/*Fecha a div emitentes dos documentos*/
			document.getElementById('emitentes_dados').style.display = 'none';
			//aguarde(1);
			/*Respons�vel por exibir a mensagem*/
			setTimeout('exibeRestricao()',5000);
		}
	}	
}
function completaDocumento(form,posicao,campo,tamanho){
	var camp_doc = form.elements[campo+'['+posicao+']'].value ;
	if(camp_doc.length > 0)
	form.elements[campo+'['+posicao+']'].value = completar(form.elements[campo+'['+posicao+']'].value,tamanho);
}
function completar(nome,quant){
	var tam = nome.length;
	for( i = 0 ; i < (quant-tam) ; i++)
		nome = '0'+nome;
	return nome;
}
function repete_emitente(form,posicao,tipo){
	if(tipo == 'REPETE'){
		//Confere se o primeiro emitente est� preenchido
		if(form.elements["emitente_replica["+posicao+"]"].checked == 1 && (form.elements["emitente[1]"].value =='' || form.elements["cpf_emitente[1]"].value == '')){
			alerta_simples('Os dados do primeiro emitente est�o incompletos.\nPreencha-os antes de continuar.');
			form.elements["emitente_replica["+posicao+"]"].checked = 0;
			return false;
		}
		if(form.elements["emitente_replica["+posicao+"]"].checked == 1){
			form.elements["emitente["+posicao+"]"].value 		= form.elements["emitente[1]"].value;
			form.elements["cpf_emitente["+posicao+"]"].value 	= form.elements["cpf_emitente[1]"].value;
			form.elements["tipo_emitente["+posicao+"]"].value 	= form.elements["tipo_emitente[1]"].value;
			document.getElementById('emitente_dados_cpf'+posicao).style.display = '';
			document.getElementById('emitente_dados_emitente'+posicao).style.display = '';
		}
		else{
			form.elements["emitente["+posicao+"]"].value 		= '';
			form.elements["cpf_emitente["+posicao+"]"].value 	= '';
			form.elements["tipo_emitente["+posicao+"]"].value 	= '';
			document.getElementById('emitente_dados_cpf'+posicao).style.display = 'none';
			document.getElementById('emitente_dados_emitente'+posicao).style.display = 'none';
		}
	}
	else{
		for( i = 1 ; i <= abs(form.parcela.value) ; i++){
				/*Setando os valores de cpf, nome e ipo emitente*/
				form.elements["emitente["+i+"]"].value 			= form.elements["mesmoemitente"].checked == 1  ? form.elements["aluno"].value : '';
				form.elements["cpf_emitente["+i+"]"].value 		= form.elements["mesmoemitente"].checked == 1 ? form.elements["cpf"].value : '';
				form.elements["tipo_emitente["+i+"]"].value 	= form.elements["mesmoemitente"].checked == 1 ? (form.elements["cpf"].value.length == 14 ? 'CPF' : 'CNPJ' ): '';
				/*Exibindo ou nao os campo*/
				document.getElementById("emitente_dados_cpf"+i).style.display 			= form.elements["mesmoemitente"].checked == 1 ? '' : 'none';
				document.getElementById("emitente_dados_emitente"+i).style.display 		= form.elements["mesmoemitente"].checked == 1 ? '' : 'none';
				
				if( i > 1){
					form.elements["emitente_replica["+i+"]"].checked = form.elements["mesmoemitente"].checked == 1 ? 1 : 0;
				}		
		}
	}
}
function mesmo_emitente(form){
	if(form.omesmo.checked==1){
		form.emitente.value=form.aluno.value;
		form.cpf_emitente.value=form.cpf.value;
		form.emitente.disabled=1;
		form.cpf_emitente.disabled=1;
	}
	else{
		form.emitente.value='';
		form.cpf_emitente.value='';
		form.emitente.disabled=0;
		form.cpf_emitente.disabled=0;
	}
}
function mudaValor(form){
	var total1 = 0.00;
	var total2 = 0.00;
	var valor = 0;
	for(x = 1 ; x <=abs(form.parcela.value) ; x++){
		total2 += parseFloat(form.elements['parcela_refinanciada['+x+']'].value);
		valor = parseFloat(form.elements['parcela_refinanciada['+x+']'].value);
		form.elements['valor_div_emitente['+x+']'].value = valor.toFixed(2);
	}
	form.geral_parametro.value = total2.toFixed(2);
	if((parseFloat(form.geral.value) != parseFloat(form.geral_parametro.value) && abs(form.parcela.value) > 0)){
		document.getElementById('total_parametro1').style.display = '';
		document.getElementById('total_parametro2').style.display = '';
	}
	else{
		document.getElementById('total_parametro1').style.display = 'none';
		document.getElementById('total_parametro2').style.display = 'none';
	}
}
function possuiDinheiro(form){
	form.total_em_dinheiro.value = 0 ;
	for(x = 1 ; x <=max_parcelamento ; x++)
	if(form.elements["tipo_rec["+x+"]"].value == 'dinheiro')
			form.total_em_dinheiro.value = parseFloat(form.total_em_dinheiro.value) + parseFloat(form.elements["parcela_refinanciada["+x+"]"].value);
	if(parseFloat(form.total_em_dinheiro.value) > 0){
		document.getElementById('id_troco').style.display = '';
	}
	else{
		document.getElementById('id_troco').style.display = 'none';
	}
	if(form.elements['tipo_rec[1]'].value == 'dinheiro' || form.elements['tipo_rec[1]'].value == 'boleto'){
		document.getElementById('dados_emitente1').style.display = 'none';  
		document.getElementById('dados_emitente_no1').style.display = ''; 
		form.elements['cheque[1]'].value 	='XXXXXX';
		form.elements['banco[1]'].value		= 'XXX' ;
	}
	else{
		if(document.getElementById('dados_emitente1').value == 'XXXXXX'){
			form.elements['cheque[1]'].value = '';
		}
		document.getElementById('dados_emitente1').style.display = '';  
		document.getElementById('dados_emitente_no1').style.display = 'none'; 
		document.getElementById('dados_emitente_no1').style.display = 'none'; 
	}
}

function calcula(form)
{
	var total_vista=0.00;
	var total_vista_calcula=0.00;
	var total_sem_desconto=0.00;
	var maior=0;
	var tx=0;
	var aux=0;
	var entrada=0;
	/*verifica se existe data setada nas parcelas vencidas*/
	for(x=1;x<=12;x++){
		/*Confere se existe algum valor em parcela: Se existir deixa o valor e acrescenta data atual caso nao haja*/
		if(form.elements["parc["+x+"]"].value!='' && form.elements["parc["+x+"]"].value!=0)
		{
			form.exibe.value = x + 1;
			exibeCima(form);
			if(form.elements["d_["+x+"]"].value=='')
				form.elements["d_["+x+"]"].value=form.elements["d_a"].value;
			if(form.elements["m_["+x+"]"].value=='')
				form.elements["m_["+x+"]"].value=form.elements["m_a"].value;
			if(form.elements["a_["+x+"]"].value=='')
				form.elements["a_["+x+"]"].value=form.elements["a_a"].value;
		}	
		//Se nao existir, deixe as dtas em branco
		else{
			form.exibe.value = x ;
			form.elements["d_["+x+"]"].value = '';
			form.elements["m_["+x+"]"].value = '';
			form.elements["a_["+x+"]"].value = '';
		}
		/* calcula o atraso de cada parcela para juros e multa*/
		form.elements["atraso["+x+"]"].value=diasEntreDatas(form.elements["d_["+x+"]"].value+'/'+form.elements["m_["+x+"]"].value+'/'+form.elements["a_["+x+"]"].value , form.elements["d_a"].value+'/'+form.elements["m_a"].value+'/'+form.elements["a_a"].value);
		/*calcula juros e multa se houver atraso*/
		if(form.elements["atraso["+x+"]"].value>0)
		{
			//MUlta = parcela X multa configurada no sistema / 100
			form.elements["multa["+x+"]"].value=form.elements["parc["+x+"]"].value*form._multa.value/100;
			aux = form.elements["multa["+x+"]"].value; // formata os resultados
			aux = parseFloat(aux);
			form.elements["multa["+x+"]"].value= aux.toFixed(2);
			aux = form.elements["parc["+x+"]"].value*form._juros.value*form.elements["atraso["+x+"]"].value/100;
			aux = parseFloat(aux);
			form.elements["juros["+x+"]"].value=aux.toFixed(2);
		}
		else
		{
			form.elements["multa["+x+"]"].value='0.00';
			form.elements["juros["+x+"]"].value='0.00';
		}
		if(form.elements["parc["+x+"]"].value=='')
			form.elements["parc["+x+"]"].value=0;
		aux = (parseFloat(form.elements["parc["+x+"]"].value)+parseFloat(form.elements["multa["+x+"]"].value)+parseFloat(form.elements["juros["+x+"]"].value));
		aux = parseFloat(aux);
		form.elements["total["+x+"]"].value=aux.toFixed(2);
		total_vista+=parseFloat(form.elements["parc["+x+"]"].value);
		total_vista_calcula+=parseFloat(form.elements["total["+x+"]"].value);
	}
	form.elements["total_vista_calcula"].value=total_vista_calcula.toFixed(2);
	form.elements["total_vista"].value=centavos2(total_vista);
	/*===================================================*/
	/*=       Calculo das parcelas refinanciadas        =*/
	/*===================================================*/
	maior = abs(form.parcela.value);
	if(abs(form.parcela.value)>0 && form.elements["d_ref["+maior+"]"].value=='' && form.elements["m_ref["+maior+"]"].value=='' && form.elements["a_ref["+maior+"]"].value=='')
		preencheDataRefinan(form,abs(parseInt(form.parcela.value)));
		
	/*Habilita campo da entrada*/
	if(form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value && form.parcela.value>1 && form.parcela.value < 9999)
		form.entrada.disabled=0;
	else
		form.entrada.disabled=1;
	
	entrada=0;
	num_parcelas = form.parcela.value;
	if(form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value && form.parcela.value>1)
		num_parcelas = abs(form.parcela.value)-1;
	
	for(x=1;x<=max_parcelamento;x++)
	{
		tx=0;
		var parcela_pos = abs(form.parcela.value);
		if(x<=abs(form.parcela.value))
		{
			if(form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value && form.parcela.value>1)
				num_parcelas=form.parcela.value-1;
			//Nao  deixa calcular atraso para a vista no cheque ou parcelamento com entrada
			if (form.parcela.value==-1 || form.parcela.value == 9999 || (form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value && form.parcela.value>1 && x==1))
			{
				atraso=0;
				entrada = form.elements['parcela_ref[1]'].value;
				form.elements['d_ref[1]'].disabled=1;
				form.elements['m_ref[1]'].disabled=1;
				form.elements['a_ref[1]'].disabled=1;
			}
			else if(form.parcela.value!=-1 && form.parcela.value!= 9999)
			{
				tx = form._taxa.value;
				form.elements['d_ref[1]'].disabled=0;
				form.elements['m_ref[1]'].disabled=0;
				form.elements['a_ref[1]'].disabled=0;
				atraso = diasEntreDatas(form.elements["d_a"].value+'/'+form.elements["m_a"].value+'/'+form.elements["a_a"].value,form.elements["d_ref["+maior+"]"].value+'/'+form.elements["m_ref["+maior+"]"].value+'/'+form.elements["a_ref["+maior+"]"].value);
			}
			//Bloqueia 1� parcela refinanciada se vc colocar entrada
			/*if(form.elements['parcela_ref[1]'].disabled == 0)
				form.elements['parcela_refinanciada[1]'].disabled=1;
			else
				form.elements['parcela_refinanciada[1]'].disabled=0;*/
			
			if(form.elements["d_ref["+x+"]"].value=='' && form.elements["m_ref["+x+"]"].value=='' && form.elements["a_ref["+x+"]"].value=='')
				preencheDataRefinan(form,x);
			
			if(form.parcela.value>1 && (form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value) && x==1);
			else
				aux = (form.total_vista_calcula.value-entrada)/abs(num_parcelas);
			
			form.elements["parcela_ref["+x+"]"].value = aux.toFixed(2);
			aux = (((total_vista_calcula - entrada) * (form._juros_ref.value/100)*atraso)+parseFloat(tx))/parseInt(num_parcelas);
			form.elements["juros_ref["+x+"]"].value = aux.toFixed(2);
			aux =  parseFloat(form.elements["juros_ref["+x+"]"].value) + parseFloat(form.elements["parcela_ref["+x+"]"].value);
			//Guarda o valor inicial do parcelamento sem o desconto
			form.elements["parcela_refinanciada_parametro["+x+"]"].value = aux.toFixed(2);
			//Guarda o valor da parcela com desconto
			aux = aux-(parseFloat(form.desconto.value)/num_parcelas);
			form.elements["parcela_refinanciada["+x+"]"].value = aux.toFixed(2);
			form.elements["valor_div_emitente["+x+"]"].value =  form.elements["parcela_refinanciada["+x+"]"].value;
			
			if(form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value && form.parcela.value>1 && x==1){
				
				//entrada = parseFloat(entrada);
				form.elements["parcela_refinanciada["+x+"]"].value = entrada;
				form.elements["parcela_refinanciada_parametro["+x+"]"].value = entrada;
			}
			total_sem_desconto+=parseFloat(form.elements['parcela_refinanciada_parametro['+x+']'].value);
		}
	}
	form.total_sem_desconto.value=total_sem_desconto.toFixed(2);
	//parte de baixo com dinheiro
	if(form.parcela.value==0){
		aux = parseFloat(form.total_vista_calcula.value);
		form.total_sem_desconto.value=aux.toFixed(2);
	}	
	aux=parseFloat(form.total_sem_desconto.value) - parseFloat(form.desconto.value);
	form.geral.value = aux.toFixed(2);
	//parte de baixo com entrada
	if(form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value && form.parcela.value>1){
		form.elements['parcela_ref[1]'].value=entrada;
		form.elements['parcela_refinanciada[1]'].value=centavos2(entrada);
		form.elements['parcela_refinanciada_parametro[1]'].value=centavos2(entrada);
	}
	//parte de baixo À vista: faz arredondamentos importantes
	if(form.parcela.value==-1 || form.parcela.value==9999){
		form.total_sem_desconto.value                 			 = form.total_vista_calcula.value;
		form.elements['parcela_ref[1]'].value         			 = form.total_vista_calcula.value;
		aux														 = parseFloat(form.elements['total_sem_desconto'].value) - parseFloat(form.desconto.value);
		form.elements['parcela_refinanciada[1]'].value			 = aux.toFixed(2);
		aux														 = parseFloat(form.elements['total_sem_desconto'].value) - parseFloat(form.desconto.value);
		form.elements['parcela_refinanciada_parametro[1]'].value = aux.toFixed(2);
		aux				                              			 = parseFloat(form.total_vista_calcula.value) - parseFloat(form.desconto.value);
		form.geral.value										 = aux.toFixed(2);
		form.elements['d_ref[1]'].value							 = form.d_a.value;
		form.elements['m_ref[1]'].value							 = form.m_a.value;
		form.elements['a_ref[1]'].value 						 = form.a_a.value;
	}
	//Exibição da Div Troco
	
	possuiDinheiro(form);
	//====================================================
	//=  Trata da marcacao dos campos cheque ou dinheiro =
	//====================================================
	//====================================================
	//=    Monta o display de forma de pagamento         =
	//====================================================
	if(form.parcela.value==0 && parseFloat(form.total_vista_calcula.value)>0)
	{
		form.extenso.value='R$ '+form.geral.value+' � vista em Dinheiro.';
	}
	else if(form.parcela.value==-1)
	{
		form.extenso.value='R$ '+form.geral.value+' � vista no cheque.';
	}
	else if(form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value)
	{
		parcelas = form.parcela.value -1;
		cada = centavos2((form.geral.value-form.elements['parcela_refinanciada[1]'].value)/parcelas);
		form.extenso.value = 'Entrada de R$ '+form.elements['parcela_refinanciada[1]'].value+' e '+parcelas+' parcela(s) de R$ '+cada;
	}
	else
	{
		parcela_impressa = form.elements['parcela_refinanciada[1]'].value - (form.desconto.value/form.parcela.value);
		form.extenso.value= form.parcela.value+' parcela(s) de R$ '+centavos2(parcela_impressa)+'.';
	}
}
function marca_radio_ok(inicio,form){
	for(x=parseInt(inicio,10)+1;x<=form.parcela.value;x++)
	{
		form.elements['tipo_rec['+x+']'].value = form.elements['tipo_rec['+inicio+']'].value;
		if(form.elements['tipo_rec['+x+']'].value == 'ccredito' || form.elements['tipo_rec['+x+']'].value == 'cdebito' || form.elements['tipo_rec['+x+']'].value == 'boleto' || form.elements['tipo_rec['+x+']'].value == ''){
			form.elements['banco['+x+']'].value = 'XXX';
			form.elements['cheque['+x+']'].value = (form.elements['tipo_rec['+x+']'].value == 'boleto' ? 'XXXXXX' : '');
		}
		else if(form.elements['banco['+x+']'].value == 'XXX'){
			form.elements['banco['+x+']'].value = '';
			form.elements['cheque['+x+']'].value = '';
		}
	}	
}
function marca_radio(inicio,form){
	possuiDinheiro(form);
	if(form.elements['tipo_rec['+inicio+']'].value == 'ccredito' || form.elements['tipo_rec['+inicio+']'].value == 'cdebito'  || form.elements['tipo_rec['+inicio+']'].value == 'boleto'){
		form.elements['banco['+inicio+']'].value = 'XXX';
		form.elements['cheque['+inicio+']'].value = (form.elements['tipo_rec['+inicio+']'].value == 'boleto' ? 'XXXXXX' : '');
	}
	else if(form.elements['tipo_rec['+inicio+']'].value == 'dinheiro' ){
		form.elements['banco['+inicio+']'].value = 'XXX';
		form.elements['cheque['+inicio+']'].value = 'XXXXXX';
	}
	else if(form.elements['banco['+inicio+']'].value == 'XXX'){
		form.elements['banco['+inicio+']'].value = '';
		form.elements['cheque['+inicio+']'].value = '';
	}
		
	if(abs(form.parcela.value)!=inicio && form.elements['tipo_rec['+inicio+']'].value!='dinheiro'){
		aviso('CONFIRME','Completar o restante com esse tipo de Docucmento?','CONFIRMACAO',"marca_radio_ok('"+inicio+"',form);");
	}
}
//Preenche automaticamente as datas dos cheques refinanciados
function clonaDesabilitados(form){
	var maior;
	if(max_parcelamento > 12)
		maior = max_parcelamento;
	else
		maior = 12;
	for(x=1;x<=maior;x++)
	{
		if(x<=abs(form.parcela.value)){
			form.elements['juros_ref_['+x+']'].value=form.elements['juros_ref['+x+']'].value;
			form.elements['parcela_ref_['+x+']'].value=form.elements['parcela_ref['+x+']'].value;	
			form.elements['parcela_refinanciada_['+x+']'].value=form.elements['parcela_refinanciada['+x+']'].value;
		}
		if(x <= 12){
			form.elements['juros_['+x+']'].value		=form.elements['juros['+x+']'].value;
			form.elements['atraso_['+x+']'].value		= form.elements['atraso['+x+']'].value;
			form.elements['multa_['+x+']'].value		= form.elements['multa['+x+']'].value;
			form.elements['total_['+x+']'].value		= form.elements['total['+x+']'].value;
			form.elements['parc['+x+']'].disabled 		= 0 ;
			form.elements['d_['+x+']'].disabled 		= 0 ;
			form.elements['m_['+x+']'].disabled 		= 0 ;
			form.elements['a_['+x+']'].disabled 		= 0 ;
		}
		
	}
	form.total_sem_desconto_.value=form.total_sem_desconto.value;
	form.total_vista_.value = form.total_vista.value;
	form.total_vista_calcula_.value=form.total_vista_calcula.value;
}

function preencheDataRefinan(form,x)
{
	//Guarda o dia da negociacao em todas as datas
	form.elements["d_ref["+x+"]"].value=form.d_a.value;
	//Coloca 1 mes a mais em cada parcela
	form.elements["m_ref["+x+"]"].value=((parseInt(form.m_a.value,10) + x) % 12);
	//Cola 0 no inicio do numero do mes menor que 10
	if(parseInt(form.elements["m_ref["+x+"]"].value) < 10)
		form.elements["m_ref["+x+"]"].value = '0'+form.elements["m_ref["+x+"]"].value;
	//Mes 12 dar� 0 entao colocasse 12 se for 0;
	if(form.elements["m_ref["+x+"]"].value==0)form.elements["m_ref["+x+"]"].value = 12;
	//Guarda o ano em cada data
	form.elements["a_ref["+x+"]"].value=form.a_a.value;
	//Muda o ano de acordo com o numero de parcelas e o mes
	var aux = 0;
	aux = (parseInt(form.m_a.value,10)+x-1)/12;
	aux = aux+'';
	aux = aux.split('.');
	aux = aux[0];
	//Guarda novo valor do ano
	form.elements["a_ref["+x+"]"].value=parseInt(form.a_a.value,10) + parseInt(aux,10);
	
	while(!verificaData2(form.elements["d_ref["+x+"]"].value+'/'+form.elements["m_ref["+x+"]"].value+'/'+form.elements["a_ref["+x+"]"].value))
		form.elements["d_ref["+x+"]"].value-=1;
}

function centavos(form,posicao)
{
	var centavos;
	form.elements["parc["+posicao+"]"].value = form.elements["parc["+posicao+"]"].value.replace(',','.');
	form.elements['desconto'].value = form.elements['desconto'].value.replace(',','.');
	if(form.elements["parc["+posicao+"]"].value.indexOf('.')!=-1)
	{
		
		campo = form.elements["parc["+posicao+"]"].value.split('.');
		centavos = campo[1];
		numero=campo[0]+'.'+centavos.substr(0,2);
		form.elements["parc["+posicao+"]"].value=numero;
	}
}

function centavos2(numero)
{
	var centavos;
	numero = numero.toString();
	var campo;
	if(numero.indexOf('.')!=-1)
	{
		campo = numero.split('.');
		centavos = campo[1];
		numero=campo[0]+'.'+centavos.substr(0,2);
		return numero;
	}
	else
		return numero+'.00'; 
}

function dateDiff(strDate1,strDate2)
{
	return (((Date.parse(strDate2))-(Date.parse(strDate1)))/(24*60*60*1000)).toFixed(0);
}

function diasEntreDatas(arrDataInicial, arrDataFinal)
{
	var mes, dataAtual, dataInicial, novaDataInicial, diasEntreDatas;
	mes = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	if(arrDataInicial=='//')
		return 0;
	arrDataInicial = arrDataInicial.split("/");
	arrDataFinal = arrDataFinal.split("/");
	novaDataInicial = mes[(arrDataInicial[1] - 1)] + ' ' + arrDataInicial[0] + ' ' + arrDataInicial[2];
	novaDataFinal = mes[(arrDataFinal[1] - 1)] + ' ' + arrDataFinal[0] + ' ' + arrDataFinal[2];
	return dateDiff(novaDataInicial, novaDataFinal);
}
function autoTab(form,input,len, e) 
{
	var keyCode = (isNN) ? e.which : e.keyCode;
	var filter = (isNN) ? [0,8,9] : [0,8,9,16,17,18,37,38,39,40,46];
	if(input.value.length >= len && !containsElement(filter,keyCode)) 
	{
		input.value = input.value.slice(0, len);
		input.form[(getIndex(input)+1) % input.form.length].focus();
		input.form[(getIndex(input)+1) % input.form.length].select();
		calcula(form);
		return true;
	}
}

function containsElement(arr, ele) 
{
	var found = false, index = 0;
	while(!found && index < arr.length)
	if(arr[index] == ele)
		found = true;
	else
		index++;
	return found;
}
function getIndex(input) 
{
	var index = -1, i = 0, found = false;
	while (i < input.form.length && index == -1)
		if (input.form[i] == input)index = i;
		else i++;
	return i;
}

function somente_numero(campo){
    var digits="0123456789."
    var campo_temp
    for (var i=0;i<campo.value.length;i++){
      campo_temp=campo.value.substring(i,i+1)    
      if (digits.indexOf(campo_temp)==-1){
            campo.value = campo.value.substring(0,i);
            break;
       }
    }
}
function abs(num)
{
	if(num<0)
		return num*(-1);
	if(num == 9999)
		return 1;
	return num;
}
function voltar_etapa(etapa,form){
	if(etapa ==1){
		document.getElementById('refinanciamento').style.display = 'none';
		document.getElementById('renegociacao').style.display = '';
		form.parcela.value = '';
	}
	else{
		if(form.total_vista_calcula.value == 0){
			alerta_simples('Valor zerado. Preencha o(s) valor(es).');
			form.parcela.value = '';
		}
		else{
			document.getElementById('refinanciamento').style.display = '';
			document.getElementById('renegociacao').style.display = 'none';	
			exibeBaixo(form,1);
		}
	}
}
function calculaTroco(form,valor){
	var aux ;
	
	document.getElementById('id_div_troco').style.width = document.body.scrollWidth + 'px';;
	document.getElementById('id_div_troco').style.height = document.body.scrollHeight + 'px';
	
	if(valor == '0')
		valor = form.total_recebido_em_dinheiro.value ;
	valor 							= valor.replace(",",".");
	form.total_em_dinheiro.value	= form.total_em_dinheiro.value.replace(",",".");
	
	form.troco_aluno.value = parseFloat(valor) - parseFloat(form.total_em_dinheiro.value);
	
	//Colocando duas casas decimais
	aux = parseFloat(form.troco_aluno.value);
	form.troco_aluno.value					= aux.toFixed(2);
	
	document.getElementById('id_div_troco').style.display = '';
}
function fecha_troco(){
	document.getElementById('id_div_troco').style.display = 'none';
}
function exibeBaixo(form,onde){
	var numero;
	calcula(form);
	numero = abs(form.parcela.value);
	if(form.parcela.value == 0){
		//document.getElementById('refinanciamento').style.display = 'none';
		//document.getElementById('renegociacao').style.display = '';
	}
	else{
		document.getElementById('refinanciamento').style.display = '';
		document.getElementById('renegociacao').style.display = 'none';
	}
	if((form.parcela.value==-1 || form.parcela.value == 9999) && onde){
		form.elements['d_ref[1]'].value=form.d_a.value;
		form.elements['m_ref[1]'].value=form.m_a.value;
		form.elements['a_ref[1]'].value=form.a_a.value;
		form.elements['d_ref[1]'].disabled = 1;
		form.elements['m_ref[1]'].disabled = 1;
		form.elements['a_ref[1]'].disabled = 1;
	}
	if(numero>0)
	{
		for(i=1;i<=8;i++)
		{
			document.getElementById('titulo'+i).style.display = '';  
		}
	}
	else
	{
		for(i=1;i<=8;i++)
		{
			document.getElementById('titulo'+i).style.display = 'none';  
		}
	}
	for(i=1;i<=max_parcelamento;i++)
	{
		if(i<=numero)
		{
			
			document.getElementById('tipo_rec'+i).style.display = '';  
			document.getElementById('parcela'+i).style.display = '';  
			document.getElementById('data'+i).style.display = '';  
			document.getElementById('dados_emitente'+i).style.display = '';  
			document.getElementById('cheque'+i).style.display = '';  
			document.getElementById('banco'+i).style.display = '';  
			document.getElementById('juros'+i).style.display = '';  
			document.getElementById('parcelarefinanciada'+i).style.display = ''; 
			document.getElementById('emitente_dados_parc'+i).style.display = '';  
			document.getElementById('emitente_dados_valor'+i).style.display = '';  
			document.getElementById('emitente_dados_tipo'+i).style.display = '';  
			  
			document.getElementById('emitente_replicar'+i).style.display = '';
			
			for(n = 0 ; n < 5 ; n++)
				document.getElementById('id_tipo_rec'+i).options[n] = null ;
				
			if(form.parcela.value == -1){
				document.getElementById('id_tipo_rec'+i).options[0] = new Option('-------','');  
				document.getElementById('id_tipo_rec'+i).options[1] = new Option('Cheque','cheque');  
				document.getElementById('id_tipo_rec'+i).options[2] = new Option('Cartão de Débito','cdebito');  
			}
			else if(form.parcela.value == 9999){
				document.getElementById('id_tipo_rec'+i).options[0] = new Option('Dinheiro','dinheiro');
				document.getElementById('id_tipo_rec'+i).options[1] = null ;
				document.getElementById('id_tipo_rec'+i).options[2] = null ;
				document.getElementById('id_tipo_rec'+i).options[3] = null ;
				document.getElementById('id_tipo_rec'+i).options[4] = null ;
			}
			else {
				document.getElementById('id_tipo_rec'+i).options[0] = new Option('-------','');    
				document.getElementById('id_tipo_rec'+i).options[1] = new Option('Cheque','cheque');  
				document.getElementById('id_tipo_rec'+i).options[2] = new Option('Cartão de Cédito','ccredito');  
				document.getElementById('id_tipo_rec'+i).options[3] = new Option('Cartão de Débito','cdebito');  
				document.getElementById('id_tipo_rec'+i).options[2] = new Option('Boleto Bancário','boleto');
				if(i == 1)
					document.getElementById('id_tipo_rec'+i).options[4] = new Option('Dinheiro','dinheiro');
			}
		}
		else
		{
			document.getElementById('tipo_rec'+i).style.display = 'none';  
			document.getElementById('parcela'+i).style.display = 'none';  
			document.getElementById('data'+i).style.display = 'none';  
			document.getElementById('dados_emitente'+i).style.display = 'none';  
			document.getElementById('cheque'+i).style.display = 'none';  
			document.getElementById('banco'+i).style.display = 'none';  
			document.getElementById('juros'+i).style.display = 'none';  
			document.getElementById('parcelarefinanciada'+i).style.display = 'none	';  
			document.getElementById('emitente_dados_parc'+i).style.display = 'none';  
			document.getElementById('emitente_dados_tipo'+i).style.display = 'none';  
			document.getElementById('emitente_dados_valor'+i).style.display = 'none';  
			document.getElementById('emitente_dados_cpf'+i).style.display = 'none';  
			document.getElementById('emitente_dados_emitente'+i).style.display = 'none';  
			document.getElementById('emitente_replicar'+i).style.display = 'none';  
		}
	}
	possuiDinheiro(form);
}
function excluiParcela(form, posicao){
	/*for(y=1;y<=7;y++){
		document.getElementById('emCima'+y+posicao).style.display = 'none'; 
	}*/
	form.elements['parc['+posicao+']'].value 		= 0.00 ;
	form.elements['idren_parcelas['+posicao+']'].value 	= 'NULL' ;
	form.elements['parc['+posicao+']'].disabled		= 0 ;
	form.elements['d_['+posicao+']'].disabled 		= 0 ;
	form.elements['m_['+posicao+']'].disabled 		= 0 ;
	form.elements['a_['+posicao+']'].disabled 		= 0 ;
	calcula(form);
}
function exibeCima(form){
	
	if(form.exibe.value==12)
	{
		document.getElementById('mais').style.display = 'none';
		document.getElementById('menos').style.display = '';  
	}
	else if(form.exibe.value==1)
	{
		document.getElementById('menos').style.display = 'none';
		document.getElementById('mais').style.display = '';  
	}
	else
	{
		document.getElementById('menos').style.display = '';
		document.getElementById('mais').style.display = '';  
	}
	for(i=1;i<=12;i++)
	{
		if(i<=form.exibe.value || form.elements['parc['+i+']'].value>0)
		{
			for(y=1;y<=7;y++)
			{
				document.getElementById('emCima'+y+i).style.display = ''; 
			}
		}
		else
		{
			for(y=1;y<=7;y++)
			{
				document.getElementById('emCima'+y+i).style.display = 'none'; 
			}
		}
	}
}

function verificaData(digData)
{
    var bisseito = 0;
    var data = digData;
    var tam = data.length;
    if (tam == 10)
    {
        var dia = data.substr(0,2)
        var mes = data.substr(3,2)
        var ano = data.substr(6,4)
         switch (mes)
         {
         	case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '10':
            case '12':
            if  (dia <= 31)
            {
                 return true;
            }
            break
           
            case '04':        
            case '06':
            case '09':
            case '11':
            if  (dia <= 30)
            {
                return true;
            }
            break
            case '02':
                    /* Validando ano Bissexto / fevereiro / dia */
                    if (ano % 4 == 0 && dia<=29)
                    {
                    	return true;                
                    }
                    else if(dia<29)
                    {
                        return true;
                    }            
                    break                        
        }
    }    
    alerta_simples("A Data "+data+" � inv�lida!");
    return false;
}

function verificaData2(digData)
{
    var bissexto = 0;
    var data = digData;
    var tam = data.length;
    if (tam == 10)
    {
        var dia = data.substr(0,2)
        var mes = data.substr(3,2)
        var ano = data.substr(6,4)
         switch (mes)
         {
         	case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '10':
            case '12':
            if  (dia <= 31)
            {
                 return true;
            }
            break
           
            case '04':        
            case '06':
            case '09':
            case '11':
            if  (dia <= 30)
            {
                return true;
            }
            break
            case '02':
                    /* Validando ano Bissexto / fevereiro / dia */
                    if (ano % 4 == 0 && dia<=29)
                    {
                    	return true;                
                    }
                    else if(dia<29)
                    {
                        return true;
                    }            
                    break                        
        }
    }    
    return false;
}

function guarda(form,x,t)
{
	form.elements['tipo_rec2['+x+']'].value=t;
}

function parcelasSemDesconto(form)
{
	var parc;
	var inicio=1;
	parc = abs(form.parcela.value);
	if(form.elements['d_ref[1]'].value==form.d_a.value && form.elements['m_ref[1]'].value==form.m_a.value && form.elements['a_ref[1]'].value==form.a_a.value){
		if(parc > 1){
			parc = parc-1;
			inicio=2;
		}
	}
	for(x=inicio;x<=abs(form.parcela.value);x++)
		form.elements['parcela_refinanciada['+x+']'].value = centavos2(form.elements['parcela_refinanciada['+x+']'].value-(form.desconto.value/parc));
		form.elements['parcela_refinanciada_parametro['+x+']'].value = centavos2(form.elements['parcela_refinanciada_parametro['+x+']'].value-(form.desconto.value/parc));
}

function finaliza(form){
	mudaValor(form);
	if(form.parcela.value == ''){
		alerta_simples('Selecione uma Forma de Pagamento.');
		return false;
	}
	if(parseFloat(form.geral.value) != parseFloat(form.geral_parametro.value) && form.parcela.value > 0){
		alerta_simples('O valor da somas das parcelas está diferente do total da Negociação.');
		return false;
	}
	if(form.geral.value==0){
		alerta_simples('Recebimento com valor zerado!');
		return false;
	}
	if(form.referencia.value==' ' || form.referencia.value==''){
		alerta_simples('Atenção! Coloque uma referência para o Recebimento.');
		return false;
	}
	for(x=1;x<=12;x++){ //verifica datas das parcelas
		if(form.elements['parc['+x+']'].value > 0)
		{
			if(!verificaData(form.elements['d_['+x+']'].value+'/'+form.elements['m_['+x+']'].value+'/'+form.elements['a_['+x+']'].value))
			{
				return false;
			}
		}
	}
	if(form.tipo_recebimento.value==''){
		alerta_simples('Selecione o Tipo desse Recebimento.');
		return false;
	}
	/*Conferindo as parcelas refinanciadas*/
	imprimeRecibo = 1 ;
	for(x=1;x<=abs(form.parcela.value);x++){
		
		if(!verificaData(form.elements['d_ref['+x+']'].value+'/'+form.elements['m_ref['+x+']'].value+'/'+form.elements['a_ref['+x+']'].value)){
			return false;
		}
		if((form.elements['cheque['+x+']'].value==''||  form.elements['cheque['+x+']'].value.length != 6 || form.elements['banco['+x+']'].value=='' || form.elements['banco['+x+']'].value.length != 3) && (form.elements['tipo_rec['+x+']'].value =='cheque' || form.elements['tipo_rec['+x+']'].value =='ccredito' || form.elements['tipo_rec['+x+']'].value =='cdebito')){
			if(form.elements['tipo_rec['+x+']'].value =='cheque')
				tipo_documento = 'cheque';
			else
				tipo_documento = 'cartão';
			alerta_simples('Preencha todos os dados do '+tipo_documento+' '+x+'.');
			return false;
		}
		if(form.elements['tipo_emitente['+x+']'].value == '' && form.elements['tipo_rec['+x+']'].value != 'dinheiro'){
			alerta_simples('Preencha o TIPO do emitente do documento '+x+'.');
			return false;
		}
		if(form.elements['emitente['+x+']'].value == '' && form.elements['tipo_rec['+x+']'].value != 'dinheiro'){
			alerta_simples('Preencha o NOME do emitente do documento '+x+'.');
			return false;
		}
		if(form.elements['cpf_emitente['+x+']'].value == '' && form.elements['tipo_rec['+x+']'].value != 'dinheiro'){
			alerta_simples('Preencha o CPF do emitente do documento '+x+'.');
			return false;
		}
		if(form.elements['cpf_emitente['+x+']'].value.length != 14 && form.elements['cpf_emitente['+x+']'].value.length != 18  && form.elements['tipo_rec['+x+']'].value != 'dinheiro'){
			alerta_simples('Preencha corretamente o CPF/CNPJ do emitente do documento '+x+'.');
			return false;
		}
		if(!form.elements['tipo_rec['+x+']'].value){
			alerta_simples('Selecione o tipo de Recebimento na parcela refinanciada '+x+'!');
			return false;
		}
		if(form.elements['tipo_rec['+x+']'].value != 'ccredito' && form.elements['tipo_rec['+x+']'].value != 'cdebito' && form.elements['tipo_rec['+x+']'].value != 'dinheiro')
			imprimeRecibo = 0 ;
	}
	if(form.parcela.value>=1 && !imprimeRecibo){
		form.tip.value='T';
		//parcelasSemDesconto(form);
		if(form.desconto.value > form.total_sem_desconto.value*2/100){
			if(!(form.motivo.value = prompt("O valor do desconto ultrapassou 2% do Total. Motivo:")))
				return false;
		}
		clonaDesabilitados(form);
		form.parcela.value=abs(form.parcela.value);
		aviso('CONFIRME','TERMO:\n'+montagemResultado(form)+'\nDeseja concluir o recebimento?','CONFIRMACAO',"geraRecebimento('finalizacao.php','planilha','"+form.id.value+"')");
		return false;
		
	}
	else{
		form.tip.value='R';
		//Habilita novamente a data do cheque
		form.elements['d_ref[1]'].disabled=0;
		form.elements['m_ref[1]'].disabled=0;
		form.elements['a_ref[1]'].disabled=0;
		//parcelasSemDesconto(form);
		clonaDesabilitados(form);
		form.parcela.value=abs(form.parcela.value);
		if(form.desconto.value > form.total_sem_desconto.value*2/100){
			if(!(form.motivo.value = prompt("O valor do desconto ultrapassou 2% do Total. Motivo:")))
				return false;
		}
		aviso('CONFIRME','RECIBO:\n'+montagemResultado(form)+'\nDeseja concluir o recebimento?','CONFIRMACAO',"geraRecebimento('finalizacao.php','planilha','"+form.id.value+"')");
		return false;

	}
}
function geraRecebimento(action,target,id){
	var H,V;
	var inicial;
	V = document.body.scrollWidth/10*6.5;
	H = document.body.scrollHeight;
	inicial = document.body.scrollWidth/2-V/2;
	
	if(action)endereco = action;
	if(target)janela_alvo = target;
	document.form.action = endereco;
	aguarde(1); 
	if(janela_alvo)
		document.form.target = janela_alvo; 
	if(janela_alvo){
		window.open('about:blank',janela_alvo,"scrollbars=yes,status=no,location=no, resizable=yes, left="+inicial+",width="+V+",height="+H+"");
		window.open('inicio.php?idEmpresa='+form.idEmpresa.value,'interSystem','');
	}
	document.form.submit();
}
function montagemResultado(form){
	var texto 			= '';
	var diferente_valor = 0;
	var diferente_tipo 	= 0;
	if(form.parcela.value == 0){
		texto += "Tipo de Pagamento: À vista em Dinheiro.\n";
	}
	else if(form.parcela.value == 1 && form.tip.value == 'R'){
			texto += "Tipo de Pagamento: À vista no "+(form.elements['tipo_rec[1]'].value == 'cheque' ? 'cheque' : (form.elements['tipo_rec[1]'].value == 'dinheiro' ? 'dinheiro' : 'cartão'))+".\n";
	}
	else{
		for( i=1 ; i <= form.parcela.value ; i++){
			if(i <=parseInt(form.parcela.value)-1){
				if(form.elements["parcela_refinanciada["+i+"]"].value != form.elements["parcela_refinanciada["+(parseInt(i)+1)+"]"].value){
					diferente_valor = 1;
				}
				if(form.elements["tipo_rec["+i+"]"].value != form.elements["tipo_rec["+(parseInt(i)+1)+"]"].value){
					diferente_tipo = 1;
				}
			}
		}
		if(diferente_valor == 0 && diferente_tipo == 0){
			texto += "Tipo de Pagamento: Parcelado no "+(form.elements['tipo_rec[1]'].value == 'cheque' ? 'cheque' : 'cartão')+".\n";
			texto += "Forma de Pagamento:\n";
			texto += form.parcela.value+" parcela(s) de "+form.elements["parcela_refinanciada[1]"].value+".\n";
		}
		else{
			texto += "Tipo de Pag.: Parcelado em "+form.parcela.value+"X.\n";
			texto += "Forma de Pagamento: \n";
			for( i =1 ; i <= form.parcela.value ; i++){
				texto += "Tipo:: "+(form.elements['tipo_rec['+i+']'].value == 'cheque' ? 'cheque   ' :(form.elements['tipo_rec['+i+']'].value == 'dinheiro' ? 'dinheiro   ' : 'cartão   '))+"| Valor:: "+form.elements["parcela_refinanciada["+i+"]"].value+".\n";
			}
		}
	}
	texto += "Valor Total: "+form.geral.value;
	return texto;
}