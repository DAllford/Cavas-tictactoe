angular.module("tictactoe", [])

    .directive('ticTacToe', function() {


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

        function drawBoard(board, context) {
            drawCleanBoard(context);
            for(var x=0; x<=2; x++) {
                for(var y=0; y<=2; y++) {
                    if(board[x][y].color){
                        var xcoord = x * 100 + 50;
                        var yCoord = y * 100 + 50;
                        drawCounter(xcoord, yCoord, board[x][y].color, context);
                    }
                }
            }
        }

        return {
            templateUrl: "/tictactoe/board/board.html",
            link: function(scope, element, attrs) {
                scope.canvas = element.find('canvas')[0];
                scope.ctx = scope.canvas.getContext("2d");

                drawGridLines(scope.ctx);
            },
            controller: function ($scope, boardState) {
                $scope.addCounter = function(counter) {
                    boardState.addCounter(counter);
                    drawBoard(boardState.getBoard(), $scope.ctx);
                };

                $scope.placeCounter = function (event) {
                    var xcoord = Math.min(Math.floor(event.clientX/100), 2);
                    var ycoord = Math.min(Math.floor(event.clientY/100), 2);
                    $scope.addCounter({x: xcoord, y: ycoord, color: boardState.getPlayerColor()});
                };

                $scope.$on("reset-board", function() {
                    drawCleanBoard($scope.ctx);
                    boardState.resetBoard();
                });

                $scope.backgroundColor = function () {
                    return boardState.getWinner() || "white";
                }
            }
        };
    })

    .controller("clearCtrl", function($scope, $rootScope) {
        $scope.resetBoard = function() {
            $rootScope.$broadcast("reset-board");
        }
    });