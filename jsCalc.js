var numbers = [];
var ops = [];
var master=[];
var entry = document.getElementById("entry");
var display = document.getElementById("display");

entry.value = "";
entry.focus();

function openParen(){
  display.innerText+='('
  entry.value += '(';
  numbers.push("(");
  ops.push("(");
  master.push("(")
}

function closeParen()
{
  if(master[master.length - 1]!=")"){
    numbers.push(entry.value);
    master.push(entry.value);
  }
  entry.value += ')';
  numbers.push(")");
  ops.push(")");
  master.push(")");
  display.innerText = master.join(" ")
}

//only get here from an operator, passing the value from entry.value, never from the final term ('=' sends to resolveParens())
function pushValue(val){
  //recursively removes all the opening parens from entry.value because they were already pushed into the array when entered
  if(val[0]=="("){
    val = val.slice(1,val.length);
    pushValue(val);
    //prevents push if the value ends with closeParen because would have been pushed into the array when entered
  }else if(val[val.length - 1]!=")"){
    numbers.push(val);
    master.push(val);
    display.innerText = master.join(" ")
  }
}

function add(){
  if(entry.value!=""){
    pushValue(entry.value);
  }
  ops.push("+");
  master.push("+");
  display.innerText = master.join(" ")
  entry.value = "";
  entry.focus();
}

function subtract(){
  if(entry.value!=""){
    pushValue(entry.value);
  }
  ops.push("-");
  master.push("-");
  display.innerText = master.join(" ")
  entry.value = "";
  entry.focus();
}

function multiply(){
  if(entry.value!=""){
    pushValue(entry.value);
  }
  ops.push("*");
  master.push("*");
  display.innerText = master.join(" ")
  entry.value = "";
  entry.focus();
}

function divide(){
  if(entry.value!=""){
    pushValue(entry.value);
  }
  ops.push("/");
  master.push("/");
  display.innerText = master.join(" ")
  entry.value = "";
  entry.focus();
}

function clearIt(){
  display.innerText = "";
  entry.value = "";
  numbers = [];
  ops = [];
  master = [];
  entry.focus();
}

function clearEntry(){
  if(entry.value[entry.value.length-1]==")"){
    numbers.pop();
  }
  entry.value = "";
  ops.pop();
  master.pop();
  display.innerText = master.join(" ");
  entry.focus();
}

function resolveParens(){
  //push in final entry, unless it has a closeParen, because that would have been pushed when entered
  if(entry.value[entry.value.length-1]!=")"){
    numbers.push(entry.value);
    master.push(entry.value);
  }
  display.innerText = master.join(" ")
  //loop through all sets of parens, break when no more open parens
  while(true){
    openIndex = -1;//will be reset with highest index of open paren, if any
    closeIndex = -1;//will be reset with highest index of close paren, if any
    insiders = [];//numbers inside the current set of parens
    insiderOps =[];//operators inside the current set of parens
    //iterate through array looking for open parens
    for(let index = 0; index < numbers.length; index++){
      if(numbers[index]=="("){
        //set openIndex to the highest index with an openParen
        openIndex = index;
      }
    }
    //if an openParen was found, find the closest closeParen
    if(openIndex != -1){
      for(let i = openIndex + 1; i < numbers.length; i++){
        if(numbers[i] == ")"){
          closeIndex = i;
          //1st one found breaks the loop
          break;
        }
      }
      //now process the operations between the parentheses:
      //add the numbers to an subset array (insiders)
      //add the ops to a subset array (insiderOps)

      for(let k = openIndex + 1; k < closeIndex; k++){
        insiders.push(numbers[k]);
        insiderOps.push(ops[k]);
      }
      //remove the used up operators from ops
      ops.splice(openIndex,closeIndex - openIndex);


      //set value at index of openParen to calculated value
      numbers[openIndex] = findMD(insiders,insiderOps)
      //remove the other values from openIndex + 1 to closeIndex
      numbers.splice(openIndex + 1,closeIndex - openIndex);
    }else{
      //no more open parens, end while loop
      break;
    }
  }
  //send final values for calculation
  findMD(numbers,ops);
}

//find and execute multiplication and division
function findMD(values,operators){
  while(true){
    times = operators.indexOf("*");
    div = operators.indexOf("/");

    //both * and / are in the operator array:
    if(times!= -1 && div != -1){
      //choose the one closer to the front of the array
      if(times < div){
        //multiplies the two numbers together keeping the product at the index of the 1st factor, and removing the index of the 2nd factor.
        values[times] = values[times] * values[times + 1];
        values.splice(times + 1, 1);
        operators.splice(times,1);
      }else{
        //divides the two numbers together keeping the quotient at the index of the 1st dividend, and removing the index of the divisor.
        values[div] = values[div]/values[div + 1];
        values.splice(div + 1, 1);
        operators.splice(div,1);
      }
      //only have either * or /, not both
    }else if(times != -1){
      values[times] = values[times] * values[times + 1];
      values.splice(times + 1, 1);
      operators.splice(times,1);
    }else if(div!= -1){
      values[div] = values[div]/values[div + 1];
      values.splice(div + 1, 1);
      operators.splice(div,1);
    }else{
      //have neither * nor /
      break;
    }
  }
  //send the results to check for addition/subtraction
  return(addEmUp(values, operators));
}

function addEmUp(valAdd, opsAdd){
  //start off the sum with the first element
  var result = parseFloat(valAdd.shift());
  while(valAdd.length > 0){
    op = opsAdd.shift();
    if(op=="+"){
      result += (parseFloat(valAdd.shift()));
    }else{
      result -= parseFloat((valAdd.shift()));
    }
  }
  entry.value = result;
  display.innerText = master.join(" ") + " = " + result;
  return result;
}
