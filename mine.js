const AROUND = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];

function shuffle(arr, n) {
    let i;
    let len = arr.length;
    let count = len;
    while (len - count < n) {
        i = Math.floor(Math.random() * (count--));
        [arr[i], arr[count]] = [arr[count], arr[i]];
    }
    return arr;
};

function shuffles(arr, n) {
    let i;
    let count = arr.length;
    while (count) {
        i = Math.floor(Math.random() * (count--));
        [arr[i], arr[count]] = [arr[count], arr[i]];
    }
    return arr;
};

function getEnvironment(data, i, j) {
    var environment = [];
    AROUND.forEach(offset => {
        let row = i + offset[0];
        let col = j + offset[1];
        if (
            data[row] !== undefined &&
            data[row][col] !== undefined
        ) {
            environment.push(data[row][col]);
        }
    });
    return environment;
}

class Mine {

    constructor(x, y, n) {
        let size = x * y;
        if (n > size) {
            n = size;
        }

        this.size = size;
        this.x = x;
        this.y = y;
        this.n = n;

        this.start();
    }

    start() {
        let mineArea = new Array(this.n).fill(Mine.Space.mine);
        let safeArea = new Array(this.size - this.n).fill(Mine.Space.safe);

        let shuffleArea = shuffle(safeArea.concat(mineArea), this.n);
        this.data = this.getData(shuffleArea);
        this.getEnvData();

        // 结果
        this.result = undefined;
        // 正确的红旗数
        this.rightFlag = 0;
        // 总红旗数
        this.flag = 0;
        // 问号总数
        this.mark = 0;
    }

    getData(shuffleArea) {
        let data = [];
        let x = this.x;
        let y = this.y;
        for (let i = 0; i < x; i++) {
            var d = [];
            for (let j = 0; j < y; j++) {
                d.push(
                    {
                        x: i,
                        y: j,
                        value: shuffleArea[i * y + j],
                        status: 0
                    }
                );
            }
            data.push(d);
        }
        return data;
    }

    getEnvData() {
        var data = this.data;
        let x = this.x;
        let y = this.y;
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                if (data[i][j].value == Mine.Space.mine) {
                    let spaces = getEnvironment(data, i, j);
                    spaces.forEach(space => {
                        if (space.value !== Mine.Space.mine) {
                            space.value++;
                        }
                    });
                }
            }
        }
    }

    isGameOver() {
        return this.result === false;
    }

    isGameVictory() {
        return this.result === true;
    }

    getGameStatus() {
        if (this.isGameVictory()) {
            return Mine.Result.success;
        } else if (this.isGameOver()) {
            return Mine.Result.fail;
        } else {
            return Mine.Result.normal;
        }
    }

    checkGame() {
        if (this.result === undefined) {
            if (this.mark == 0 &&
                this.flag == this.rightFlag &&
                this.rightFlag === this.n
            ) {
                this.result = true;
            }
        }

        // 赢了则自动翻牌
        if (this.result === true) {
            this.data.forEach(d => {
                d.forEach(item => {
                    if (item.status === Mine.State.blank) {
                        item.status = Mine.State.click;
                    }
                })
            });
        }

        // 输了则纠正错误的标识，并且显示所有的地雷
        else if (this.result === false) {
            this.data.forEach(d => {
                d.forEach(item => {
                    if (item.value === Mine.Space.mine) {
                        item.status = Mine.State.mine;
                    } else if (item.status === Mine.State.flag) {
                        item.status = Mine.State.error;
                    }
                })
            });
        }
    }

    click(data) {
        let self = this;
        if (this.isGameOver()) {
            return;
        }

        function clickBlank(data) {
            if (data.value == Mine.Space.mine) {
                data.status = Mine.State.mine;
                self.result = false;
            } else {
                if (data.value === 0) {
                    data.status = Mine.State.back;
                    let spaces = getEnvironment(self.data, data.x, data.y);
                    spaces.filter(space => {
                        return space.status === Mine.State.blank;
                    }).forEach(space => {
                        clickBlank(space);
                    });
                } else {
                    data.status = Mine.State.click;
                }
            }
        }

        function clickFlag() {
            data.status = Mine.State.blank;
            if (data.value === Mine.Space.mine) {
                self.rightFlag--;
            }
            self.flag--;
        }

        function clickMark(data) {
            data.status = Mine.State.blank;
            self.mark--;
        }

        switch (data.status) {
            case Mine.State.blank:
                clickBlank(data);
                break;
            case Mine.State.click:
                break;
            case Mine.State.back:
                break;
            case Mine.State.flag:
                clickFlag(data);
                break;
            case Mine.State.mark:
                clickMark(data);
                break;
            case Mine.State.mine:
                break;
        }

        this.checkGame();
    }

    rightClick(data) {
        let self = this;
        if (this.isGameOver()) {
            return;
        }

        function clickBlank(data) {
            data.status = Mine.State.flag;
            if (data.value === Mine.Space.mine) {
                self.rightFlag++;
            }
            self.flag++;
        }

        function clickFlag(data) {
            data.status = Mine.State.mark;
            if (data.value === Mine.Space.mine) {
                self.rightFlag--;
            }
            self.flag--;
            self.mark++;
        }

        function clickMark(data) {
            data.status = Mine.State.blank;
            self.mark--;
        }

        switch (data.status) {
            case Mine.State.blank:
                clickBlank(data);
                break;
            case Mine.State.click:
                break;
            case Mine.State.back:
                break;
            case Mine.State.flag:
                clickFlag(data);
                break;
            case Mine.State.mark:
                clickMark(data);
                break;
            case Mine.State.mine:
                break;
        }

        this.checkGame();
    }
}

Mine.Result = {
    normal: 0,
    success: 1,
    fail: 2
};

Mine.Space = {
    safe: 0,
    mine: 9
}

Mine.State = {
    blank: 0,
    click: 1,
    back: 2,
    flag: 3,
    mark: 4,
    mine: 5,
    error: 6
}