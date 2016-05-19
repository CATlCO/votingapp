(function() {
	[].slice.call(document.querySelectorAll('select.select_field')).forEach(function(select) {
		select.onchange = function() {
			select.className += ' selected';
		}
	});

	var plus = document.getElementById('plus');
	var optionCount = 3;
	if (plus) {
		plus.onclick = function(e){
			e.preventDefault();
			var list = document.getElementById('input_list');
			var clone = list.lastElementChild.cloneNode(true);
			clone.children[0].value = "";
			clone.children[1].children[0].innerHTML = "Option " + optionCount;
			list.appendChild(clone);
			checkInputs();
			
			optionCount += 1;
			if (optionCount > 12) { 
				plus.style.visibility='hidden';
			}
		};
	}
	

	if (!String.prototype.trim) {
		(function() {
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
				return this.replace(rtrim, '');
			};
		})();
	}

	checkInputs();

	function checkInputs(){
		[].slice.call(document.querySelectorAll('input.input_field')).forEach(function(inputEl){
			if( inputEl.value.trim() !== '' ) {
				classie.add( inputEl.parentNode, 'filled' );
			}
			inputEl.addEventListener( 'focus', onInputFocus );
			inputEl.addEventListener( 'blur', onInputBlur );
		} );
	}
	

	function onInputFocus( ev ) {
		classie.add( ev.target.parentNode, 'filled' );
	}

	function onInputBlur( ev ) {
		if( ev.target.value.trim() === '' ) {
			classie.remove( ev.target.parentNode, 'filled' );
		}
	}

	
})();