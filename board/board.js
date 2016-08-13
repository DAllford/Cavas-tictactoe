angular.module("tictactoe", [])

    .directive('ticTacToe', function() {
        return {
            templateUrl: "/tictactoe/board/board.html",
            link: function(scope, element, attrs) {
                scope.canvas = element.find('canvas')[0];
                scope.ctx = scope.canvas.getContext("2d");

                drawGridLines(scope.ctx);
            },
            controller: function ($scope, boardState) {
                $scope.addCounter = function(counter) {
                    var xcoord = counter.x * 100 + 50;
                    var yCoord = counter.y * 100 + 50;
                    if(boardState.addCounter(counter)){
                        drawCounter(xcoord, yCoord, counter.color, $scope.ctx);
                    }
                };

                $scope.placeCounter = function (event) {
                    var xcoord = Math.floor(event.clientX/100);
                    var ycoord = Math.floor(event.clientY/100);
                    $scope.addCounter({x: xcoord, y: ycoord, color: boardState.getPlayerColor()});
                };

                $scope.$on("reset", function() {
                    drawCleanBoard($scope.ctx);
                    boardState.resetBoard();
                });

                $scope.backgroundColor = function () {
                    return boardState.getWinner();
                }
            }
        };
    })

    .controller("clearCtrl", function($scope, $rootScope) {
        $scope.resetBoard = function() {
            $rootScope.$broadcast("reset");
        }
    })
    .service('boardState', function () {
        var playerColors = ["blue", "red"];
        var playerNum = 0;
        function emptyBoard() {
            return [[], [], []];
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
                if(!counters[newCounter.x][newCounter.y]) {
                    counters[newCounter.x][newCounter.y] = {color: newCounter.color};
                    switchPlayer();
                    return true;
                }
                return false;
            },
            resetBoard: function() {
                counters = emptyBoard();
            },
            getWinner: function() {
                return getWinner(counters) || "white";
            }
        }
    });

function getWinner(board) {
    function checkLine(line) {
        var mappedLine = line.map(function(square) {
            square = square || {color: null};
            return square.color;
        });
        if(mappedLine[0] && (mappedLine[0] == mappedLine[1] && mappedLine[1] == mappedLine[2])) {
            return mappedLine[0];
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
        winner = winner || checkLine(line);
    });
    return winner;
}


function drawGridLines(ctx) {
    drawVerticalLine(ctx, 100);
    drawVerticalLine(ctx, 200);
    drawHorizontalLine(ctx, 100);
    drawHorizontalLine(ctx, 200);
    function drawVerticalLine (ctx, xcoord) {
        ctx.moveTo(xcoord, 0);
        ctx.lineTo(xcoord, 300);
        ctx.stroke();
    }
    function drawHorizontalLine (ctx, ycoord) {
        ctx.moveTo(0, ycoord);
        ctx.lineTo(300, ycoord);
        ctx.stroke();
    }
};

function drawCleanBoard(ctx) {
    ctx.beginPath();
    ctx.clearRect(0, 0, 300, 300);
    drawGridLines(ctx);
}

function drawCounter(xcoord, yCoord, color, context) {
    context.beginPath();
    context.arc(xcoord, yCoord, 40, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = 5;
    context.stroke();
};