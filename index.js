
var mine = new Mine(20, 20, 10);

var app = new Vue({
  el: '#app',
  data: {
    mine: mine
  },
  methods: {
    start() {
      mine.start();
    },

    click(data) {
      var result = mine.getGameStatus();
      if (result === 0) {
        mine.click(data);
        this.checkResult();
      }
    },

    dblclick(data) {
      mine.dbclick(data);
    },

    rightClick(data) {
      mine.rightClick(data);
      this.checkResult();
    },

    checkResult() {
      setTimeout(() => {
        var result = mine.getGameStatus();
        if (result == 1) {
          alert('you win');
        }
        else if (result == 2) {
          alert('you fail');
        }
      }, 100);
    }
  }
});