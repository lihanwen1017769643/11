// JavaScript Document
var width = 800;
var height = 560;
var turn = 0;
var init_num = 0;
var target_num = 0;
var current_num = 0;
var food_num = 0;
var arr4 = new Array();
var time;

$(document).ready(function (e) {
    var snake = new Snake();
    snake.init();
});

// return random number in [min, max]
function rand_num(min, max) {
    parseInt(Math.random() * (max - min + 1) + min, 10);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// randomly pick 4 number in [min, max]
function getRandom(min, max) {
    arr4 = new Array();
    var tmp;
    while (arr4.length < 4) {
        tmp = rand_num(min, max);
        if (!arr4.includes(tmp)) {
            arr4.push(tmp);
        }
    }
    arr4.sort(function (a, b) {
        return a - b;
    });
}

var Snake = function () {
    this.currentDrection = 'right';
    this.nextDrection = 'right';
    this.snakeHeadLeft = 0;
    this.snakeHeadTop = 0;
    this.snakeBodyLeft = 0;
    this.snakeBodyTop = 0;
}

Snake.prototype = {
    init: function () {
        var _this = this;
        // init snake
        $('#canvas div:not(#food)').each(function (index, element) {
            $(this).css({
                'top': '100px',
                'left': (100 - index * 20) + 'px'
            });
        });

        // init food
        $('#food').css({
            'left': '300px',
            'top': '100px'
        });
        // food_num = rand_num(1, 10);
        // $('#food').text(food_num);
        food_num = 0;
        if (food_num == 0) {
            $('#food').html('<i class="fas fa-solid fa-question"></i>');
        }

        // init start button
        $('#start').click(function (e) {
            // set initial and target number
            init_num = rand_num(1, 10);
            target_num = rand_num(11, 100);
            current_num = init_num;
            $('#initial').text(init_num);
            $('#target').text(target_num);
            $('#info').css('display', 'block');
            $('#play').click(function (e) {
                $('#info').css('display', 'none');
                $('#current_num').text(current_num);
                $('#tgt_num').text(target_num);
                $('#turn').text(turn);
                $('#canvas').focus();
                _this.run();
                _this.ListenDirection();
            });
        });
    },

    run: function () {
        var _thisRun = this,
            temp;
        this.currentDrection = this.nextDrection;
        this.snakeHeadLeft = $('#snakeHead').css('left');
        this.snakeHeadTop = $('#snakeHead').css('top');
        this.snakeBodyLeft = null;
        this.snakeBodyTop = null;

        if (this.nextDrection == 'left') {
            temp = (parseInt($('#snakeHead').css('left')) - 20 + width) % width + 'px';
            $('#snakeHead').css({
                'left': temp
            });
        } else if (this.nextDrection == 'right') {
            temp = (parseInt($('#snakeHead').css('left')) + 20) % width + 'px';
            $('#snakeHead').css({
                'left': temp
            });
        } else if (this.nextDrection == 'up') {
            temp = (parseInt($('#snakeHead').css('top')) - 20 + height) % height + 'px';
            $('#snakeHead').css({
                'top': temp
            });
        } else if (this.nextDrection == 'down') {
            temp = (parseInt($('#snakeHead').css('top')) + 20) % height + 'px';
            $('#snakeHead').css({
                'top': temp
            });
        }

        $('#canvas div:not(#snakeHead,#food)').each(function (index, element) {
            _thisRun.snakeBodyLeft = $(this).css('left');
            _thisRun.snakeBodyTop = $(this).css('top');
            $(this).css({
                'left': _thisRun.snakeHeadLeft,
                'top': _thisRun.snakeHeadTop
            });
            _thisRun.snakeHeadLeft = _thisRun.snakeBodyLeft;
            _thisRun.snakeHeadTop = _thisRun.snakeBodyTop;
        });

        if (checkDead()) {
            var pro = new Promise(function (resolve, reject) {
                _thisRun.checkFood(resolve);
                // console.log(current_num, food_num);
            })
            // increase speed with game progress
            pro.then((dat) => {
                $('#canvas').focus();
                if (dat == "success") {
                    // new food coordiantes
                    var foodLeft = parseInt(rand_num(1, (width - 40) / 20) * 20) + 'px';
                    var foodTop = parseInt(rand_num(1, (height - 40) / 20) * 20) + 'px';
                    $('#food').css({
                        'left': foodLeft,
                        'top': foodTop
                    });
                    if (turn <= 10)
                        food_num = rand_num(0, 0);
                    else if (10 < turn <= 20)
                        food_num = rand_num(0, 0);
                    else if (10 < turn <= 20)
                        food_num = rand_num(0, 0);
                    else
                        food_num = rand_num(0, 0);
                    if (food_num == 0) {
                        $('#food').html('<i class="fas fa-solid fa-question"></i>');
                    } else
                        $('#food').text(food_num);

                    // longer snake body
                    function longer_snake() {
                        var left = parseInt(($('.snakeTail').eq(0).css('left'))) - 20 + 'px';
                        var top = $('.snakeTail').eq(0).css('top');
                        $('.snakeTail').removeClass('snakeTail');
                        $('<div>').css({
                            'left': left,
                            'top': top
                        }).addClass('snakeTail').appendTo('#canvas');
                    }
                    if (turn <= 10) {
                        longer_snake();
                    } else if (10 < turn <= 20) {
                        longer_snake();
                        longer_snake();
                    } else if (20 < turn <= 30) {
                        longer_snake();
                        longer_snake();
                        longer_snake();
                        longer_snake();
                    } else {
                        longer_snake();
                        longer_snake();
                        longer_snake();
                        longer_snake();
                        longer_snake();
                        longer_snake();
                    }

                    // change the content in current_num
                    $('#current_num').text(current_num);
                } else if (dat == "finish") {
                    _thisRun.currentDrection = 'right';
                    _thisRun.nextDrection = 'right';
                    alert('恭喜你顺利达成目标数字！');
                    reset();
                    return;
                    // console.log(turn, current_num, target_num);
                    // $("#final_turn").text(turn);
                    // $("#finish").css('display', 'block');
                    // var next = new Promise(function (resolve, reject) {
                    // 	$('#ok').click(function (e) {
                    // 		$("#finish").css('display', 'none');
                    // 		console.log(turn, current_num, target_num);
                    // 		$('#ok').off("click");
                    // 		resolve("next");
                    // 	});
                    // });
                    // next.then((dat) => {
                    // 	console.log(dat);
                    // 	if (dat == "next") {
                    // 		_thisRun.currentDrection = "right";
                    // 		_thisRun.nextDrection = "right";
                    // 		reset();
                    // 		snake.init();
                    // 	}
                    // })
                }

                if (turn <= 10) {
                    var time = window.setTimeout(function () {
                        _thisRun.run();
                    }, 200);
                } else if (10 < turn <= 20) {
                    var time = window.setTimeout(function () {
                        _thisRun.run();
                    }, 150);
                } else if (20 < turn <= 30) {
                    var time = window.setTimeout(function () {
                        _thisRun.run();
                    }, 100);
                } else {
                    var time = window.setTimeout(function () {
                        _thisRun.run();
                    }, 50);
                }
            });
        }

        // check if dead
        function checkDead() {
            var
                that = _thisRun,
                // _time = time,
                result = true;
            headLeft = parseInt($('#snakeHead').css('left'));
            headTop = parseInt($('#snakeHead').css('top'));

            // check if eats itself
            $('#canvas div:not(#snakeHead,#food)').each(function () {
                if (headLeft == parseInt($(this).css('left')) && headTop == parseInt($(this).css('top'))) {
                    that.currentDrection = 'right';
                    that.nextDrection = 'right';
                    alert('吃到自己啦！再试一次吧！');
                    reset();
                    result = false
                }
            });

            // check if hits boundary
            if (headLeft == 0 || headLeft == width - 20 || headTop == 0 || headTop == height - 20) {
                that.currentDrection = 'right';
                that.nextDrection = 'right';
                alert('撞墙啦！再试一次吧！');
                reset();
                result = false;
            }

            return result;
        }

        // reset snake, food
        function reset() {
            $('#canvas div:not(#food)').each(function (index, element) {
                $(this).css({
                    'top': '100px',
                    'left': (100 - index * 20) + 'px'
                });
            });
            $('#food').css({
                'left': '300px',
                'top': '100px'
            });
            $('#food').text(rand_num(1, 10));
            $('#canvas div:not(#snakeHead,#food):gt(3)').remove();
            $('#current_num').text("");
            $('#tgt_num').text("");
            $('#turn').text("");
            $('#final_turn').text("");

            turn = 0;
            init_num = 0;
            target_num = 0;
            current_num = 0;
            food_num = 0;
            // clear timer
            let end = setInterval(function () {}, 100);
            for (let i = 1; i <= end; i++) {
                clearInterval(i);
            }
            location.reload();
        }
    },

    // manipulate snake controlled by player
    ListenDirection: function () {
        var _thisDirection = this;
        $('#canvas').keydown(function (e) {
            if (e.keyCode == 37 && _thisDirection.currentDrection != 'right') _thisDirection.nextDrection = 'left';
            else if (e.keyCode == 38 && _thisDirection.currentDrection != 'down') _thisDirection.nextDrection = 'up';
            else if (e.keyCode == 39 && _thisDirection.currentDrection != 'left') _thisDirection.nextDrection = 'right';
            else if (e.keyCode == 40 && _thisDirection.currentDrection != 'up') _thisDirection.nextDrection = 'down';
        });
    },

    // eat food and reset food position
    checkFood: function (resolve) {
        if (($('#snakeHead').css('left') == $('#food').css('left')) && ($('#snakeHead').css('top') == $('#food').css('top'))) {
            // show computing div
            var p = new Promise(function (resolve, reject) {
                if (food_num == 0) {
                    $('#magic').css('display', 'block');
                    if (turn <= 10) {
                        getRandom(1, 15);
                    } else if (10 < turn <= 20) {
                        getRandom(1, 10);
                    } else if (20 < turn <= 30) {
                        getRandom(1, 7);
                    } else {
                        getRandom(1, 5);
                    }
                    $(".c1").text(arr4[0]);
                    $(".c2").text(arr4[1]);
                    $(".c3").text(arr4[2]);
                    $(".c4").text(arr4[3]);
                    $(".c1").click(function (e) {
                        $('#magic').css('display', 'none');
                        food_num = arr4[0];
                        $('.c1').off("click");
                        $('.c2').off("click");
                        $('.c3').off("click");
                        $('.c4').off("click");
                        resolve("ok");
                    });
                    $(".c2").click(function (e) {
                        $('#magic').css('display', 'none');
                        food_num = arr4[1];
                        $('.c1').off("click");
                        $('.c2').off("click");
                        $('.c3').off("click");
                        $('.c4').off("click");
                        resolve("ok");
                    });
                    $(".c3").click(function (e) {
                        $('#magic').css('display', 'none');
                        food_num = arr4[2];
                        $('.c1').off("click");
                        $('.c2').off("click");
                        $('.c3').off("click");
                        $('.c4').off("click");
                        resolve("ok");
                    });
                    $(".c4").click(function (e) {
                        $('#magic').css('display', 'none');
                        food_num = arr4[3];
                        $('.c1').off("click");
                        $('.c2').off("click");
                        $('.c3').off("click");
                        $('.c4').off("click");
                        resolve("ok");
                    });
                } else {
                    resolve("ok");
                }
            });

            p.then((dat) => {
                turn = turn + 1;
                $("#turn").text(turn);

                $('#comp').css('display', 'block');
                $('#comp_current_num').text(current_num);
                $('#comp_food_num').text(food_num);

                if (current_num + food_num <= 100) {
                    $('#plus').css('color', 'red');
                    $('#plus').click(function (e) {
                        $('#comp').css('display', 'none');
                        current_num = current_num + food_num;
                        $('#current_num').text(current_num);
                        // console.log(current_num, food_num);
                        $('#plus').off("click");
                        $('#minus').off("click");
                        $('#xmark').off("click");
                        $('#divide').off("click");
                        if (current_num == target_num)
                            resolve("finish");
                        else
                            resolve("success");
                    });
                } else {
                    $('#plus').css('color', '#999');
                    $('#plus').off("click");
                }
                if (current_num - food_num > 0) {
                    $('#minus').css('color', 'red');
                    $('#minus').click(function (e) {
                        $('#comp').css('display', 'none');
                        current_num = current_num - food_num;
                        $('#current_num').text(current_num);
                        // console.log(current_num, food_num);
                        $('#plus').off("click");
                        $('#minus').off("click");
                        $('#xmark').off("click");
                        $('#divide').off("click");
                        if (current_num == target_num)
                            resolve("finish");
                        else
                            resolve("success");
                    });
                } else {
                    $('#minus').css('color', '#999');
                    $('#minus').off("click");
                }
                if (current_num * food_num <= 100) {
                    $('#xmark').css('color', 'red');
                    $('#xmark').click(function (e) {
                        $('#comp').css('display', 'none');
                        current_num = current_num * food_num;
                        $('#current_num').text(current_num);
                        // console.log(current_num, food_num);
                        $('#plus').off("click");
                        $('#minus').off("click");
                        $('#xmark').off("click");
                        $('#divide').off("click");
                        if (current_num == target_num)
                            resolve("finish");
                        else
                            resolve("success");
                    });
                } else {
                    $('#xmark').css('color', '#999');
                    $('#xmark').off("click");
                }
                if (current_num % food_num == 0) {
                    $('#divide').css('color', 'red');
                    $('#divide').click(function (e) {
                        $('#comp').css('display', 'none');
                        current_num = current_num / food_num;
                        $('#current_num').text(current_num);
                        // console.log(current_num, food_num);
                        $('#plus').off("click");
                        $('#minus').off("click");
                        $('#xmark').off("click");
                        $('#divide').off("click");
                        if (current_num == target_num)
                            resolve("finish");
                        else
                            resolve("success");
                    });
                } else {
                    $('#divide').css('color', '#999');
                    $('#divide').off("click");
                }
            })
        } else {
            resolve("resume");
        }
    }
}