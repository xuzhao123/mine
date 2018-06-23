
var mine = new Mine(50, 50, 0);

var app = new Vue({
  el: '#app',
  data: {
    data: mine.data
  },
  methods: {
    click(data) {
      var result = mine.getGameStatus();
      if (result === 0) {
        mine.click(data);
        this.checkResult();
      }
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