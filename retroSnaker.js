(function (window) {
    // 创建游戏对象
    function Game() {
        this.map = this.createMap();
        this.food = this.createFood({map: this.map});
        this.snake = this.createSnake({map: this.map})
    }
    // 给对象添加方法
    Game.prototype = {
        constructor: Game,
        createMap: function () {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var mapWidth = (parseInt((windowWidth - 500) / 20)) * 20;
            var mapHeight = (parseInt((windowHeight - 200) / 20)) * 20;
            var body = document.body;
            // 创建button
            var button = document.createElement('button');
            button.style.display = 'block';
            button.style.margin = '0 auto';
            // button.
            setCss(button, {
                display: 'block',
                margin: '0 auto'
            });
            button.innerText = '开始游戏';
            button.id = 'btn';
            body.appendChild(button);
            // 创建map
            var div = document.createElement('div');
            setCss(div, {
                height: mapHeight + 'px',
                width: mapWidth + 'px',
                backgroundColor: '#ccc',
                margin: '0 auto',
                position: 'relative'
            });
            body.appendChild(div);

            // 设置样式函数
            function setCss(dom, object) {
                if (object) {
                    for (var k in object) {
                        dom.style[k] = object[k];
                    }
                }
            }

            return div;
        },
        createFood: function (options) {
            function Food(options) {
                options = options || {};
                this.height = options.height || 20;
                this.width = options.width || 20;
                this.bgColor = options.bgColor || 'red';
                this.x = options.x || 0;
                this.y = options.y || 0;
                this.map = options.map;
            }

            Food.prototype.render = function () {
                var div = document.createElement('div');
                div.style.height = this.height + 'px';
                div.style.width = this.width + 'px';
                div.style.backgroundColor = this.bgColor;
                this.y = parseInt(Math.random() * (this.map.offsetHeight / this.height));
                this.x = parseInt(Math.random() * (this.map.offsetWidth / this.width));
                div.style.position = 'absolute';
                div.style.top = this.y * this.height + 'px';
                div.style.left = this.x * this.width + 'px';
                this.map.appendChild(div);
            };
            return new Food(options);
        },
        createSnake: function (options) {
            var game = this;
            function Snake(options) {
                options = options || {};
                this.height = options.height || 20;
                this.width = options.width || 20;
                this.bodyColor = options.bodyColor || 'black';
                this.hendColor = options.hendColor || 'green';
                this.body = [
                    {x: 2, y: 0, bgColor: this.hendColor},
                    {x: 1, y: 0, bgColor: this.bodyColor},
                    {x: 0, y: 0, bgColor: this.bodyColor}
                ];
                this.direction = options.direction || 'right';
                this.map = options.map;

            }

            //添加把蛇渲染到地图的方法
            Snake.prototype.render = function () {
                for (var i = 0; i < this.body.length; i++) {
                    var span = document.createElement('span');
                    span.style.width = this.width + 'px';
                    span.style.height = this.height + 'px';
                    span.style.backgroundColor = this.body[i].bgColor;
                    span.style.position = 'absolute';
                    span.style.top = this.body[i].y * this.height + 'px';
                    span.style.left = this.body[i].x * this.width + 'px';
                    this.map.appendChild(span);
                }
            };
            // 添加移动的方法
            Snake.prototype.move = function (food) {
                // 移动蛇身的位置
                var lastY = this.body[this.body.length - 1].y;
                var lastX = this.body[this.body.length - 1].x;
                for (var i = this.body.length - 1; i > 0; i--) {
                    this.body[i].x = this.body[i - 1].x;
                    this.body[i].y = this.body[i - 1].y;
                }
                //移动蛇头的位置
                switch (this.direction) {
                    case 'right':
                        this.body[0].x++;
                        break;
                    case 'left':
                        this.body[0].x--;
                        break;
                    case 'button':
                        this.body[0].y++;
                        break;
                    case 'top':
                        this.body[0].y--;
                        break;
                }
                // 当蛇头的位置与食物重合的时候，蛇增长，重新生成食物
                if (this.body[0].x === food.x && this.body[0].y === food.y) {
                    this.body.push({
                        x: lastX,
                        y: lastY,
                        bgColor: this.bodyColor
                    });
                    // 删除食物
                    var div = this.map.querySelector('div');
                    div.remove();
                    // 重新生成食物
                    food.render();
                }
                // 当蛇头撞到自己的身体时，蛇死亡。
                for (var i = 3; i < this.body.length; i++) {
                    if (this.body[i].x === this.body[0].x && this.body[i].y === this.body[0].y) {
                        alert('你已经死亡！');
                        console.log(1);
                        clearInterval(this.timer);
                        game.again();
                    }
                }
                // 从新渲染到地图上
                // 先删除原来的span
                var spans = this.map.querySelectorAll('span');
                for (var i = 0; i < spans.length; i++) {
                    spans[i].remove();
                }
                // 重新渲染
                this.render();
            };
            return new Snake(options)
        },
        init: function () {
            this.snake.render();
            this.food.render();
            var that = this;
            document.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 38:
                        that.snake.direction = that.snake.direction == 'button' ? 'button' : 'top';
                        break;
                    case 39:
                        that.snake.direction = that.snake.direction == 'left' ? 'left' : 'right';
                        break;
                    case 40:
                        that.snake.direction = that.snake.direction == 'top' ? 'top' : 'button';
                        break;
                    case 37:
                        that.snake.direction = that.snake.direction == 'right' ? 'right' : 'left';
                        break;
                }
            }
        },
        start: function () {
            this.init();
            var that = this;
            document.getElementById('btn').onclick = function () {
                if (that.snake.timer) {
                    clearInterval(that.snake.timer);
                }
                that.snake.timer = setInterval(function () {
                    that.snake.move(that.food);
                    if (that.snake.body[0].x < 0 || that.snake.body[0].y < 0
                        || that.snake.body[0].x > that.map.offsetWidth / that.snake.width - 1
                        || that.snake.body[0].y > that.map.offsetHeight / that.snake.height - 1) {
                        alert('你已经死亡！');
                        clearInterval(that.snake.timer);
                        console.log(2);
                        that.again();
                    }
                }, 300)
            }
        },
        again:function(){
            // 清除蛇与食物
            this.map.remove();
            document.getElementById('btn').remove();
            //重新开始游戏
            var newGame = new Game();
            newGame.start();
        }
    };
    window.Game = Game;
})(window);


