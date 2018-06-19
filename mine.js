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

class Mine {

    constructor(x, y, n) {

        this.x = x;
        this.y = y;
        this.n = n;

        let size = x * y;
        if (n > size) {
            n = size;
        }

        let mineArea = new Array(n).fill(9);
        let safeArea = new Array(size - n).fill(0);

        let shuffleArea = this.shuffle(safeArea.concat(mineArea), n);
        this.data = this.getData(shuffleArea);
        this.getEnvData();
    }

    shuffle(arr, n) {
        let i;
        let len = arr.length;
        let count = len;
        while (len - count < n) {
            i = Math.floor(Math.random() * (count--));
            [arr[i], arr[count]] = [arr[count], arr[i]];
        }
        return arr;
    };

    shuffles(arr, n) {
        let i;
        let count = arr.length;
        while (count) {
            i = Math.floor(Math.random() * (count--));
            [arr[i], arr[count]] = [arr[count], arr[i]];
        }
        return arr;
    };

    getData(shuffleArea) {
        let data = [];
        let x = this.x;
        let y = this.y;
        for (let i = 0; i < x; i++) {
            var d = [];
            for (let j = 0; j < y; j++) {
                d.push(shuffleArea[i * y + j]);
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
                if (data[i][j] == 9) {
                    AROUND.forEach(offset => {
                        let row = i + offset[0];
                        let col = j + offset[1];
                        if (
                            data[row] !== undefined &&
                            data[row][col] !== undefined &&
                            data[row][col] !== 9
                        ) {
                            data[row][col]++;
                        }
                    });
                }
            }
        }
    }
}