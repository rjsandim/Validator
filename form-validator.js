(function( $ ){
	$.fn.formValidator = function() {
 		
 		var passwordValue;
		var is;
		var BORDER_COLOR_SUCCESS = "rgb(39, 173, 30)";
		var BORDER_COLOR_ERROR = "rgb(224, 23, 23)";
		var validator = { 
			email: function validateEmail(value, element) {
				var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return validateByRegex(value, element, regex);
			}, 
			cpf: function validateCPF(value, element) {
				if (validatorCPF(value)) {
					return success(element);
				} else {
					return error(element);
				}
			}, 
			required : function isRequired(value, element) {
				if (value.length) { 
					return success(element);
				} else {
					return error(element);
				}
			}, 
			date: function validateDate(value, element) {
				var regex = /^(0([1-9])|(1|2)([0-9])|3([0-1]))\/(0([1-9])|1([0-2]))\/(19|2[0-9])[0-9]{2}/;
				return validateByRegex(value, element, regex);
			},
			phone: function validatePhone(value, element) {
				var regex = /^\([0-9]{2}\)\s[0-9]{4}\-[0-9]{4}[0-9]?/;
				return validateByRegex(value, element, regex);
			},
			cep: function validateCEP(value, element) {

				$.ajax({
					url: 'http://webservice.efice.com.br/' + value,
					type: 'GET',
				}).done(function(jsonString) {
					var json = $.parseJSON(jsonString);

					var form = element.closest('form');
					if (json.success) {
						var estado = form.find('.estado');
						var cidade = form.find('.cidade');
						var bairro = form.find('.bairro');
						var endereco = form.find('.endereco');

						estado.val(json.estado);
						cidade.val(json.cidade);
						bairro.val(json.bairro);
						endereco.val(json.logradouro_tipo + " " + json.logradouro);

						success(estado);
						success(cidade);
						success(bairro);
						success(endereco);
						return success(element);

					} else {
						return error(element);
					}

				}).fail(function() {
					return error(element);
				});
			},
			money: function validateMoney(value, element) {
				var regex = /^(\R\$\s)?([0-9]{1,3}\.)*[0-9]{1,3}\,[0-9]{2}/;
				return validateByRegex(value, element, regex);
			},
			firstPass: function validatePass(value, element) {
				passwordValue = value;

				if (value.length) { 
					return success(element);
				} else {
					return error(element);
				}
			},
			secondPass: function confirmPass(value, element) {
				if (passwordValue === value && value.length) {
					return success(element);
				} else {
					return error(element);
				}
			},

		};

		var masks = {
			cpf: function cpfMask(e) {
				e.mask("999.999.999-99");
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
				e.mask("(99) 9999-9999?9", {placeholder:" "});
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
					symbolStay: false
				});
			}
		};

		function init() {
			
			$('form').each(function() {
			
				$(this).find('input').each(function (i) {
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
		
		function validateByRegex(value, element, regex) {
			if(regex.exec(value)) {
				return success(element);
			} else {
				return error(element);
			}
		}

		function success(element) {
			element.css("border-color", BORDER_COLOR_SUCCESS);
			return true;
		}

		function error(element) {
			element.css("border-color", BORDER_COLOR_ERROR); 
			return false;
		}

		function genericValidation() {
			
			is = $(this).attr('is');
			var fn = validator[is];
			var v = $(this).val();

			if (typeof fn === "function") { 
				return fn(v, $(this));
			}	
			return false;	
		}

		function genericValidationElement(element) {
			
			is = element.attr('is');
			var fn = validator[is];
			var v = element.val();

			if (typeof fn === "function") { 
				return fn(v, element);
			}
			return false;	
		}

		$('input').blur(genericValidation);

		$('input').on('keyup',  genericValidation);

		$(this).submit( function( event ) {
			var validationFail = false;
			$(this).find('input').each(function (i) {

				var attr = $(this).attr('is');

				if (typeof attr !== typeof undefined && attr !== false) {
   					var border = $(this).css('border-color');
   					
   					if (border != BORDER_COLOR_SUCCESS) {
   						if (!genericValidationElement($(this))) {
   							validationFail = true;
   						}
   					} 
				}	

			});

			if (validationFail) {
				event.preventDefault();
				return false;
			} else {
				return true;
			}			
		});

	};

})( jQuery );