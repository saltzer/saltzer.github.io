$(function() {

  var quotes = [{
    quote: 'Hi. My name is Anton. I studied at the System Administrator and computer systems technician in 2015. Now I am studying at the faculty of Software and Administration of Information Systems. The stack I worked with:<br><br>Monitoring: Zabbix, Grafana, ELK;<br>CI/CD: Gitlab, Docker, Kubernetes, Ansible-AWX, Jenkins;<br>Virtualization: Proxmox-VE, PBS;<br>Languages: Python;<br>Distros: Debian, Ubuntu, Arch, Centos;',
    author: 'github',
    link: 'https://github.com/saltzer'
  },
];

  var i = 0;
  var x = 0;
  var result = [];
  var $element = $('#quote');
  var $tweet = $('#tweet-wrapper');
  var htmlOutput;
  (function() {

    var minNum = 0;
    var maxNum = quotes.length;
    var randomNum = 0;

    while (result.length < maxNum) {
      randomNum = Math.floor(Math.random() * (maxNum - minNum)) + minNum;
      if (result.indexOf(randomNum) > -1) continue;
      result.push(randomNum);
    }
  })();

  function output() {
    if (x < quotes.length) {
      var num = result[x];

      if (quotes[num].link == '#') {
        htmlOutput = '<p>' + quotes[num].quote + '</p>' + '<footer><a href="#" class="brackets author">' + quotes[num].author + '</a><span class="cursor blink">&#9646;</span></footer>';
      } else {
        htmlOutput = '<p>' + quotes[num].quote + '</p>' + '<footer><a href="' + quotes[num].link + '" target="_blank" class="brackets author">' + quotes[num].author + '</a><span class="cursor blink">&#9646;</span></footer>';
      }
      $('#' + num).addClass('opened');
    } else {
      htmlOutput = '<div class="warning"><span>LOADING...</span></div>';
    }
    x++;
    return render();
  };

  output();


  var isTag, char, text;

  function render() {

    text = htmlOutput.slice(0, i++);

    if (text === htmlOutput) return i = 0;

    $element.html(text + '&#9646;');

    char = text.slice(-1);

    if (char === '<') isTag = true;
    if (char === '>') isTag = false;

    if (isTag) return render();

    return setTimeout(render, 20);
  };

  $('#newQuoteBtn').on('click', function() {

    output();

  });


});
