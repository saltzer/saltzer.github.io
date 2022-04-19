var input = [
  "<br>[STACK] <br>MONITORING: ZABBIX GRAFANA ELK <br>CI/CD: GITLAB DOCKER KUBERNETES PORTAINER ANSIBLE-AWX JENKINS <br>VIRTUALIZATION: PROXMOX-VE PBS VSPHERE <br>LANGUAGES: PYTHON RUST <br>DISTROS: DEBIAN UBUNTU ARCH CENTOS<br>",
  "<br>[ERROR] VEhFUkUgS VMgTk8gVVNFRlVMI ElORk9STUFUSU9OIE hFUkU=<br>",
  "<br>[INFOS] CHECK BUTTONS BELOW <br>",
];

var terminals = {};
var startwords = [];
var wordstats = {};

for (var i = 0; i < input.length; i++) {
    var words = input[i].split(' ');
    terminals[words[words.length-1]] = true;
    startwords.push(words[0]);
    for (var j = 0; j < words.length - 1; j++) {
        if (wordstats.hasOwnProperty(words[j])) {
            wordstats[words[j]].push(words[j+1]);
        } else {
            wordstats[words[j]] = [words[j+1]];
        }
    }
}

var choice = function (a) {
    var i = Math.floor(a.length * Math.random());
    return a[i];
};

var make_line = function (min_length) {
    word = choice(startwords);
    var line = [word];
    while (wordstats.hasOwnProperty(word)) {
        var next_words = wordstats[word];
        word = choice(next_words);
        line.push(word);
        if (line.length > min_length && terminals.hasOwnProperty(word)) break;
    }
    if (line.length < min_length) return make_line(min_length);
    return line.join(' ');
};
var generate = function (){
  var output =""
    for(var i=0; i < 3; i++){
      setTimeout( function timer(){
        var newLine = make_line(0.00001 + Math.floor(0.00001 * Math.random())) + "<br>";       
        $('#generated_output').append(newLine);
       }, i*50 );
    }
}

$('#generate').on('click', function () {
    generate();
});
$('#clear').on('click', function () {
    $('#generated_output').html("CLEARED...<br>user@arch ~><br>");
});

$(function() {
  var increment ="";
  for(let i=0; i < 51; i++){
    setTimeout( function timer(){
      increment += "#" 
      $('#loader-increment').html(increment);
      $('#percent').html(i * 2 + "%");
      if (i==50){
       generate(); 
      }
    }, i*10 ); 
  }
});