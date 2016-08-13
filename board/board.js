angular.module("tictactoe", [])

    .directive('ticTacToe', function() {
        return {
            templateUrl: "/tictactoe/board/board.html",
            link: function(scope, element, attrs) {
                scope.canvas = element.find('canvas')[0];
                var ctx = scope.canvas.getContext("2d");

                drawGridLines(ctx);

                scope.ctx = ctx;

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
                }
            },
            controller: function ($scope, boardState) {
                function drawCounter(xcoord, yCoord, color, context) {
                    context.beginPath();
                    context.arc(xcoord, yCoord, 40, 0, 2 * Math.PI, false);
                    context.fillStyle = color;
                    context.fill();
                    context.lineWidth = 5;
                    context.strokeStyle = '#003300';
                    context.stroke();
                };

                $scope.addCounter = function(counter) {
                    var xcoord = counter.x * 100 + 50;
                    var yCoord = counter.y * 100 + 50;
                    if(boardState.addCounter(counter)){
                        drawCounter(xcoord, yCoord, counter.color, $scope.ctx);
                    }
                }

                $scope.placeCounter = function (event) {
                    var xcoord = Math.floor(event.clientX/100);
                    var ycoord = Math.floor(event.clientY/100);
                    $scope.addCounter({x: xcoord, y: ycoord, color: boardState.getPlayerColor()});
                }
            }
        };
    })

    .service('boardState', function () {
        var playerColors = ["blue", "red"];
        var playerNum = 0;
        var counters = {
            0: {},
            1: {},
            2: {}
        };
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
            }
        }
    });