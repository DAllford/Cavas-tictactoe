angular.module("tictactoe")

    .service('boardState', function () {
        var playerColors = ["blue", "red"];
        var playerNum = 0;
        function emptyBoard() {
            var board = [[], [], []];
            return board.map(function() {
                return [{color: null}, {color: null}, {color: null}];
            });
        }
        function canAddCounter(newCounter) {
            return !counters[newCounter.x][newCounter.y].color && (getWinner(counters) == null) ;
        }
        var counters = emptyBoard();
        var switchPlayer = function () {
            playerNum = (playerNum+1)%2;
        };

        return {
            getPlayerColor: function() {
                return playerColors[playerNum];
            },
            addCounter: function(newCounter) {
                if(canAddCounter(newCounter)) {
                    counters[newCounter.x][newCounter.y] = {color: newCounter.color};
                    switchPlayer();
                }
            },
            resetBoard: function() {
                counters = emptyBoard();
            },
            getWinner: function() {
                return getWinner(counters);
            },
            getBoard: function() {
                return angular.copy(counters);
            }
        }
    });

function getWinner(board) {
    function getLineWinner(line) {
        var squareColors = line.map(function(square) {
            return square.color;
        });
        if(squareColors[0] && (squareColors[0] == squareColors[1] && squareColors[1] == squareColors[2])) {
            return squareColors[0];
        } else {
            return null;
        }
    }

    function getLines(board) {
        function getRows(board) {
            return angular.copy(board);
        }
        function getCols(board) {
            var cols = [];
            for(var i = 0; i<=2; i++) {
                cols[i] = [];
                for(var j=0; j<=2; j++) {
                    cols[i][j] = board[j][i];
                }
            }
            return cols;
        }
        function getDiag(board) {
            return [
                [board[0][0], board[1][1], board[2][2]],
                [board[2][0], board[1][1], board[0][2]
                ]
            ]
        }

        return getRows(board).concat(getCols(board)).concat(getDiag(board));
    }

    var lines = getLines(board);
    var winner = null;
    lines.forEach(function(line) {
        winner = winner || getLineWinner(line);
    });
    return winner;
};