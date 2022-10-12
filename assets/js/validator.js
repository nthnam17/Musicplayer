



function validator (options) {
    options.forEach(option => {
      
    var formElement = document.querySelector(option.form)
    var selectorRules = {}
    if(formElement) {
        // lắng nghe các sự kiện từ form và sử lý validate
        formElement.onsubmit = function (e) {
            e.preventDefault()
        }

        // Lắng nghe các sự kiện từ input
        option.rules.forEach(rule => {
            // lưu lại các rule mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }else {
                selectorRules[rule.selector] = [rule.test]
            }


            var inputElement = formElement.querySelector(rule.selector)
            var errorElement = inputElement.parentElement.querySelector('.auth-form__msg')
            // console.log(rule.selector)
            // console.log(inputElement)
            
            if(inputElement) {
                // Xử lý khi blur ra khỏi input
                inputElement.onblur = function () {
                    // value: inputElement.value
                    //test(): rule.test 
                    var errorMessage
                    // lấy các rule của selectỏ
                    var rules = selectorRules[rule.selector]
                    // lặp qua rule và check
                    for(var i = 0; i < rules.length; i++) {
                        errorMessage = rules[i](inputElement.value)
                        if (errorMessage) break
                    }
                    if(errorMessage) {
                        errorElement.innerHTML = errorMessage;
                        inputElement.parentElement.classList.add('invalid')
                    }else {
                        inputElement.parentElement.classList.remove('invalid')
                        errorElement.innerHTML = ''
                    }
                    
                }
                // Xử lý khi bắt đầu nhập
                inputElement.oninput = function () {
                    errorElement.innerHTML = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
            
        });

    }
    })
}


// Định nghĩa cho username
validator.isRequired = function (selector) {
    return{
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui Lòng Nhập Trường Này'
            
        }
    }
        
}


// Định nghĩa cho password
validator.isEmail = function (selector) {
    return{
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập Email'
            
        }
    }
}

// Định nghĩa cho password
validator.minLenght= function (selector, min) {
    return{
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}


validator.isConfirm= function (selector, getConfirmValue) {
    return{
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : 'Giá trị nhập vào chưa chính xác'
        }
    }
}
