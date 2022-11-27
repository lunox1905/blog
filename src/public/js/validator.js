function Validator(options){

	function getParent(element, selector) {
		while (element.parentElement) {
			if (element.parentElement.matches(selector)) {
				return element.parentElement;
			}
			element = element.parentElement;
		}
	}

	var selectorRules = {};

	function validate(inputElement, rule, errorElement){
		var error;
		var rules = selectorRules[rule.selector];

		for(var i = 0; i < rules.length; i++){
			error = rules[i](inputElement.value);
			if(error) break;
		}
		
		if(error) {
			errorElement.innerText = error;
			inputElement.classList.add('invalid');
		}
		else {
			errorElement.innerText = '';
			inputElement.classList.remove('invalid');
		}

		return !error;
	}

	var formElement = document.querySelector(options.form);
	if(formElement) {

		formElement.onsubmit = function(e) {
			e.preventDefault();
			var isFormValid = true;
			options.rules.forEach(function (rule) {
				var inputElement = formElement.querySelector(rule.selector);
				var errorElement = getParent(inputElement, options.formGroup).querySelector(options.errorSelector);
				var isValid = validate(inputElement, rule, errorElement);
				if(!isValid) {
					isFormValid = false;
				}
				
			});

			

			if(isFormValid) {
				var enableInput = formElement.querySelectorAll('[name]');
				var formValues = Array.from(enableInput).reduce(function (value, input) {
					value[input.name] = input.value;
					return value;
				}, {});
				options.onSubmit(formValues);
			}
			
		}

		options.rules.forEach(function (rule) {

			// Lưu lại rule 
			if(Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}

			var inputElement = formElement.querySelector(rule.selector)
			if(inputElement) {
				var errorElement = getParent(inputElement, options.formGroup).querySelector(options.errorSelector);
				inputElement.onblur = function () {
					validate(inputElement, rule, errorElement)
				}

				inputElement.oninput = function() {
					errorElement.innerText = '';
					inputElement.classList.remove('invalid');
				}
			}
		})
	}
}

Validator.isRequired = function(selector, message){
	return {
		selector: selector,
		test: function(value) {
			return value.trim() ? undefined : message ||'Vui lòng nhập vào đây';
		}
	};
}

Validator.isEmail = function(selector, message) {
	return {
		selector: selector,
		test: function(value) {
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return filter.test(value) ? undefined : message ||'Vui lòng nhập vào đây';
		}
	};
}

Validator.minLength = function(selector, min, message) {
	return {
		selector: selector,
		test: function(value) {
			return value.length >= min ? undefined : message ||`Password tối thiểu ${min} kí tự`;
		}
	};
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
	return {
		selector: selector,
		test : function(value) {
			return value === getConfirmValue() ? undefined : message || 'Nhập lại mật khẩu sai'
		}
	}
}