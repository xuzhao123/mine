
var mine = new Mine(20, 20, 100);

var app = new Vue({
  el: '#app',
  data: {
    data: mine.data
  }
});