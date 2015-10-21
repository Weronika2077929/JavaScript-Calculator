var box = document.getElementById('display');
var operators =['+','-','*','/'];
var dotAdded = false;

function addtoscreen(x){
    //checking if there are no two consecutive operators or operator is not on the begining
    if(operators.indexOf(x)> -1){
        var lastChar = box.value[box.value.length - 1];
        if(box.value != '' && operators.indexOf(lastChar) == -1){
            box.value +=x;
        }
        //allow - on the beginning of the expression
        else if(x == '-' && box.value == ''){
            box.value += x;
        }
        // replace the last operator with the new one
        else if( box.value != '' && operators.indexOf(lastChar) != -1){
            box.value = box.value.replace(/.$/,x);
        }
        dotAdded = false;
    }
    // only one dot might be added to represent a decimal number
    else if(x == '.'){
        if(!dotAdded){
            box.value += x;
            dotAdded = true;
        }
    }
    else {
        box.value += x;
    }
    if(x== 'c') {
        box.value = '';
    }
}

function answer(){
    x=box.value;
    var lastChar = x[x.length - 1];

    // deleting the last operator if there is no value following it
    if(operators.indexOf(lastChar) > -1 || lastChar == '.') {
        x = x.replace(/.$/, '');
    }

    x = math.eval(x);
    box.value=x;
    dotAdded = false;
}

function backspace(){
    x=box.value;
    box.value = x.substr(0, x.length-1);
}





