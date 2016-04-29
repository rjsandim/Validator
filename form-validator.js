(function( $ ){
	$.fn.formValidator = function(options) {

		var defaults = {
			customValidator: null,
			customMask: null,
			cep: {
				stateClassName: '.estado',
				cityClassName: '.cidade',
				neighborhoodClassName: '.bairro',
				streetClassName: '.endereco'
			},
			regex: {
				email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				date: /^(0([1-9])|(1|2)([0-9])|3([0-1]))\/(0([1-9])|1([0-2]))\/(19|2[0-9])[0-9]{2}/,
				phone:  /^\([0-9]{2}\)\s([0-9]\s)?[0-9]{4}\-[0-9]{4}/,
				money: /^(\R\$\s)?([0-9]{1,3}\.)*[0-9]{1,3}\,[0-9]{2}/,
				time: /^(([0-1]\d)|([2][0-3]))\:[0-5]\d/,
			},
			borderColor: {
				error: "rgb(224, 23, 23)",
				success: "rgb(39, 173, 30)", 
			},
			validadeThisSelectors: 'input, textarea',
			beforeValidate: function() {},
			afterValidate: function() {},
			beforeValidateEach: function() {},
			afterValidateEach: function() {}
		}

		var settings = $.extend( {}, defaults, options );
 		
 		var errors;
 		var passwordValue;
 		var emailValue;


		var validatorType = { 
			email: function validateEmail(value, element) {
				emailValue = value;
				return validateByRegex(value, element, settings.regex.email);
			},
			secondEmail: function confirmEmail(value, element) {
				return emailValue === value && value.length;
			},
			cpf: function validateCPF(value, element) {
				return validatorCPF(value);
			},
			cnpj: function validateCNPJ(value, element) {
				return validatorCNPJ(value);
			},
			cpf_cnpj: function validadeCpfCnpj(value, element) {
				validation = false;

				if (value.length <= 14) {        
	            	value = mascaraCPF(value);
	            	element.val(value);
	            	validation = validatorCPF(value);
	            } else {   
	            	value = mascaraCNPJ(value);
	            	element.val(value);
	            	validation = validatorCNPJ(value);
	            }

	            return validation;
 			}, 
			required : function isRequired(value, element) {
				return value.length;
			}, 
			date: function validateDate(value, element) {
				return validateByRegex(value, element, settings.regex.date);
			},
			phone: function validatePhone(value, element) {
				return validateByRegex(value, element, settings.regex.phone);
			},
			cep: function validateCEP(value, element) {

				$.ajax({
					url: 'http://webservice.efice.com.br/' + value,
					type: 'GET',
				}).done(function(jsonString) {
					var json = $.parseJSON(jsonString);

					var form = element.closest('form');
					if (json.success) {
						var state = form.find(settings.cep.stateClassName);
						var city = form.find(settings.cep.cityClassName);
						var neighborhood = form.find(settings.cep.neighborhoodClassName);
						var street = form.find(settings.cep.streetClassName);

						state.val(json.estado);
						city.val(json.cidade);
						neighborhood.val(json.bairro);
						street.val(json.logradouro_tipo + " " + json.logradouro);

						success(state);
						success(city);
						success(neighborhood);
						success(street);
						success(element);

					} else {
						return false;
					}

				}).fail(function() {
					return false;
				});
			},
			money: function validateMoney(value, element) {
				return validateByRegex(value, element, settings.regex.money);
			},
			firstPass: function validatePass(value, element) {
				passwordValue = value;

				return value.length;
			},
			secondPass: function confirmPass(value, element) {
				return passwordValue === value && value.length;
			},
			time: function validateTime(value, element) {
				return validateByRegex(value, element, settings.regex.time);
			}
		};

		var validator = $.extend( {}, validatorType, settings.customValidator);

		var masks = {
			cpf: function cpfMask(e) {
				e.mask("999.999.999-99", {placeholder:" "});
			},
			cnpj: function cnpjMask(e){
				e.mask("99.999.999/9999-99", {placeholder:" "});
			},
			date: function dateMask(e) {
				e.mask("99/99/9999");
				e.datepicker({
    				format: "dd/mm/yyyy",
    				todayBtn: "linked",
    				language: "pt_BR",
    				calendarWeeks: true,
    				autoclose: true
				}).on('hide', function(e){
       				genericValidationElement($(this));
    			});
			},
			phone: function phoneMask(e) {
				e.focusout(function(){
				    var phone, element;
				    element = $(this);
				    element.unmask();
				    phone = element.val().replace(/\D/g, '');
				    if(phone.length > 10) {
				        element.mask("(99) 9 9999-999?9", {placeholder:" "});
				    } else {
				        element.mask("(99) 9999-9999?9", {placeholder:" "});
				    }
				}).trigger('focusout');
			},
			cep: function cepMask(e) {
				e.mask("99999-999");
			},
			money: function moneyMask(e) {
				e.maskMoney({
					symbol:'R$ ', 
					showSymbol: true, 
					thousands:'.', 
					decimal:',', 
					symbolStay: true
				});
			},
			time: function timeMask(e) {
				e.mask("99:99");
			}
		};

		function init() {
			
			$('form').each(function() {
			
				$(this).find(settings.validadeThisSelectors).each(function (i) {
					var attr = $(this).attr('is');
					
					if (typeof attr !== typeof undefined && attr !== false) {

						var fn = masks[attr];
						
						if (typeof fn === "function") { 
							fn($(this));
						}	
					}	
				});
			});
		}

		init();

		function validatorCPF(str) {
			str = str.replace('.','');
			str = str.replace('.','');
			str = str.replace('-','');

			cpf = str;
			var numeros, digitos, soma, i, resultado, digitos_iguais;
			digitos_iguais = 1;
			if (cpf.length != 11) {
				return false;
			}
			for (i = 0; i < cpf.length - 1; i++) {
				if (cpf.charAt(i) != cpf.charAt(i + 1)) {
					digitos_iguais = 0;
					break;
				}
			}
			
			if (!digitos_iguais) {
				numeros = cpf.substring(0,9);
				digitos = cpf.substring(9);
				soma = 0;
				for (i = 10; i > 1; i--) {
					soma += numeros.charAt(10 - i) * i;
				}
				resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
				if (resultado != digitos.charAt(0)) {
					return false;
				}
				numeros = cpf.substring(0,10);
				soma = 0;
				for (i = 11; i > 1; i--) {
					soma += numeros.charAt(11 - i) * i;
				}
				resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
				if (resultado != digitos.charAt(1)) {
					return false;
				}
				return true;
			}
			else {
				return false;
			}
		}

		function validatorCNPJ(cnpj) {
 
		    cnpj = cnpj.replace(/[^\d]+/g,'');
		 
		    if(cnpj == '') return false;
		     
		    if (cnpj.length != 14)
		        return false;
		 
		    // Elimina CNPJs invalidos conhecidos
		    if (cnpj == "00000000000000" || 
		        cnpj == "11111111111111" || 
		        cnpj == "22222222222222" || 
		        cnpj == "33333333333333" || 
		        cnpj == "44444444444444" || 
		        cnpj == "55555555555555" || 
		        cnpj == "66666666666666" || 
		        cnpj == "77777777777777" || 
		        cnpj == "88888888888888" || 
		        cnpj == "99999999999999")
		        return false;
		         
		    // Valida DVs
		    tamanho = cnpj.length - 2
		    numeros = cnpj.substring(0,tamanho);
		    digitos = cnpj.substring(tamanho);
		    soma = 0;
		    pos = tamanho - 7;
		    for (i = tamanho; i >= 1; i--) {
		      soma += numeros.charAt(tamanho - i) * pos--;
		      if (pos < 2)
		            pos = 9;
		    }
		    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		    if (resultado != digitos.charAt(0))
		        return false;
		         
		    tamanho = tamanho + 1;
		    numeros = cnpj.substring(0,tamanho);
		    soma = 0;
		    pos = tamanho - 7;
		    for (i = tamanho; i >= 1; i--) {
		      soma += numeros.charAt(tamanho - i) * pos--;
		      if (pos < 2)
		            pos = 9;
		    }
		    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		    if (resultado != digitos.charAt(1))
		          return false;
		           
		    return true;
		    
		}

		function mascaraCPF(valor) {
	        // Remove qualquer caracter digitado que não seja numero
	        valor = valor.replace(/\D/g, "");                   
	 
	        // Adiciona um ponto entre o terceiro e o quarto digito
	        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
	 
	        // Adiciona um ponto entre o terceiro e o quarto dígitos 
	        // desta vez para o segundo bloco      
	        valor = valor.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
	 
	        // Adiciona um hifen entre o terceiro e o quarto dígitos
	        valor = valor.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");     
	        return valor;
	    }
 
	    function mascaraCNPJ(valor) {
	        // Remove qualquer caracter digitado que não seja numero
	        valor = valor.replace(/\D/g, "");                           
	 
	        // Adiciona um ponto entre o segundo e o terceiro dígitos
	        valor = valor.replace(/(\d{2})(\d)/, "$1.$2");
	        // Adiciona um ponto entre o quinto e o sexto dígitos
	        valor = valor.replace(/(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
	        valor = valor.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
	        valor = valor.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{1,2})/, "$1.$2.$3/$4-$5");
	        // Adiciona uma barra entre o oitavaloro e o nono dígitos
	        return valor;
	    }

		
		function validateByRegex(value, element, regex) {
			return regex.exec(value);
		}

		function success(element) {
			element.css("border-color", settings.borderColor.success);
			return true;
		}

		function error(element) {

			var msg = element.attr('msg');

			if (typeof msg !== typeof undefined && msg !== false) {
				errors.push(msg);
			}

			var optional = element.attr('optional');
			if (optional !== 'true') { 
				element.css("border-color", settings.borderColor.error);
			}
			console.log(optional); 
			return false;
		}

		function genericValidation() {
			
			is = $(this).attr('is');
			var fn = validator[is];
			var v = $(this).val();
			var result;

			if (typeof fn === "function") { 
				result =  fn(v, $(this));

				if (result) {
					return success($(this));
				} else {
					return error($(this));
				}
			}
		}

		function genericValidationElement(element) {
			
			var is = element.attr('is');
			var fn = validator[is];
			var v = element.val();
			var result;

			if (typeof fn === "function") { 
				result =  fn(v, element);

				if (result) {
					return success(element);
				} else {
					return error(element);
				}
			}
		}

		$(settings.validadeThisSelectors).blur(genericValidation);

		$(settings.validadeThisSelectors).on('keyup',  genericValidation);

		$(this).submit( function( event ) {
			settings.beforeValidate.call();
			var validationFail = false;
			
			errors = [];

			$(this).find(settings.validadeThisSelectors).each(function (i) {

				var attr = $(this).attr('is');

				if (typeof attr !== typeof undefined && attr !== false) {
   					var border = $(this).css('border-color');
   					
   					if (border != settings.borderColor.success) {
   						if (!genericValidationElement($(this))) {
   							validationFail = true;
   						}
   					} 
				}	

			});

			settings.afterValidate.call();

			if (validationFail) {
				event.preventDefault();
				showErrorMessages();

				return false;
			} else {
				return true;
			}			
		});


		var showErrorMessages = function() {
			if (errors.length > 0) {

				var errorHtml = ""; 
				errors.forEach(function(error) {
					errorHtml += "<p>"+error+"</p>";
				});

				swal({title: "Oops...", text: errorHtml, html: true, type: "error"});

			}
		};

	};

})( jQuery );