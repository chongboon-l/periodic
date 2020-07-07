function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function fillSquare(Element,AtomicNumber,showNumbers){
  list = ["Symbol","Element"];
  if(showNumbers){
    list = list.concat(["AtomicNumber","AtomicMass"]);
  }
  for(item of list){
    var itemElement = document.createElement('div');
    itemElement.className = item
    itemElement.innerText = data[AtomicNumber-1][item];
    document.getElementById(Element).appendChild(itemElement);
  }
}

function handleClick(event){
  button = event.target;
  button.blur();
  if (options.includes(parseInt(button.getAttribute('AtomicNumber')))){
    if(button.getAttribute("AtomicNumber") == correctAtomicNumber){
      fillSquare(button.id,correctAtomicNumber,true);
      correctScore ++;
      for(i = 0; totalOptions[i]!=correctAtomicNumber; i++){}
      totalOptions.splice(i,1);
      generateGame();
    } else{
      button.style.backgroundColor = 'LightCoral'
      incorrectScore++;
    }
  }
  document.getElementById("correctScore").innerText = correctScore;
  document.getElementById("incorrectScore").innerText = incorrectScore;
}

function generateGame(){
  squares.forEach(square => {
    square.style.backgroundColor = '';
  });
  options = getRandomArrayElements(totalOptions,numberOfOptions);
  correctIndex = Math.floor(Math.random() * numberOfOptions);
  correctAtomicNumber = options[correctIndex]
  document.getElementById("correctSquare").innerHTML = '';
  fillSquare("correctSquare",correctAtomicNumber,false);
  squares.forEach(button => {
    if (options.includes(parseInt(button.getAttribute('AtomicNumber')))){
      button.style.backgroundColor = 'LightGoldenRodYellow';
    }
  });
  squares.forEach(button => button.removeEventListener("click", handleClick));
  squares.forEach(button => button.addEventListener("click", handleClick));
}

var data;
var options = [];

function main() {
  numberOfOptions = 4;
  fetchJSONFile('periodic.json', function(dataArgument) {
    data = dataArgument;
    for (var entry of data) {
      var square = document.createElement('button');
      size = 100 / 18
      square.style.position = "absolute";
      if (entry.Group!=null){
        square.style.left = size*(entry.Group-1) + 'vw';
        square.style.top =  size*(entry.Period-1) + 'vw';
      } else{
        if(entry.Period == 6){
          square.style.left = 3*size + (entry.AtomicNumber-57)*size + 'vw';
          square.style.top =  7*size + size/3 + 'vw';
        }
        if(entry.Period == 7){
          square.style.left = 3*size + (entry.AtomicNumber-89)*size + 'vw';
          square.style.top =  8*size + size/3 + 'vw';
        }
      }
      square.className = 'square'
      square.setAttribute('AtomicNumber',entry.AtomicNumber);
      square.id = entry.Element;
      document.getElementById('table').appendChild(square);
    }
    squares = document.querySelectorAll("button");
    totalOptions = [];
    for(var i = 1; i <= 118; i++){
      totalOptions.push(i)
    }
    correctScore = incorrectScore = 0;
    generateGame();
  });
}
