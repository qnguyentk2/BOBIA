import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Common from 'components/common';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.js';
import logoPic from 'assets/images/logo.png';
import backgroundPic from 'assets/images/bg_outerspace.jpg';
import monsterPic from 'assets/images/quaivat.gif';
import 'assets/styles/Page404.scss';

// General
let canvas, screen, gameSize, game;
// Assets
let meowCanvas,
  meowMultiplier,
  meowSize = 25,
  meowAttackRate,
  meowSpeed,
  meowSpawnDelay = 250,
  colideexecuted = 0;
// Counter
let i = 0,
  kills = 0,
  lives = 3,
  spawnDelayCounter = meowSpawnDelay;

let meowDownTimer, meowAnimationFrame, keyupEvent, restartEvent, keydownEvent;
// Text
const blocks = [
  [3, 4, 8, 9, 10, 15, 16],
  [2, 4, 7, 11, 14, 16],
  [1, 4, 7, 11, 13, 16],
  [1, 2, 3, 4, 5, 7, 11, 13, 14, 15, 16, 17],
  [4, 7, 11, 16],
  [4, 8, 9, 10, 16]
];
// Game Controller
const Game = function() {
  this.level = -1;
  this.lost = false;

  this.player = new Player();
  this.meows = [];
  this.meowShots = [];

  if (meowDownTimer === undefined) {
    meowDownTimer = setInterval(function() {
      for (i = 0; i < game.meows.length; i++) game.meows[i].move();
    }, 1000 - this.level * 1.8);
  }
};

Game.prototype = {
  update: function() {
    // Next level
    if (game.meows.length === 0) {
      if (this.level !== -1) {
        $('#levelup').fadeIn(70);
      }

      spawnDelayCounter += 1;
      if (spawnDelayCounter < meowSpawnDelay) {
        return;
      }

      if (this.level !== -1) {
        $('#levelup').fadeOut(10);
        lives += 1;
      }

      this.level += 1;

      meowAttackRate -= 0.001;
      meowSpeed += 8;

      game.meows = createMeows();

      spawnDelayCounter = 0;
    }

    if (!this.lost) {
      // Collision
      game.player.projectile.forEach(function(projectile) {
        game.meows.forEach(function(meow) {
          if (collides(projectile, meow)) {
            meow.destroy();
            projectile.active = false;
          }
        });
      });

      this.meowShots.forEach(function(meowShots) {
        if (collides(meowShots, game.player)) {
          game.meowShots.active = false;
          if (colideexecuted !== 1) {
            game.player.destroy();
          }
        }
      });

      for (i = 0; i < game.meows.length; i++) {
        game.meows[i].update();
      }
    }

    // Don't stop player & projectiles.. they look nice
    game.player.update();
    for (i = 0; i < game.meowShots.length; i++) {
      game.meowShots[i].update();
    }

    this.meows = game.meows.filter(function(meow) {
      return meow.active;
    });
  },

  draw: function() {
    if (this.lost) {
      if (!$('#gameFinished').hasClass('in')) {
        $('#gameFinished').modal();

        if (kills > 999) {
          var coupon = atob('BOBIA_MEOW_DESTROYER');
          $('#message').html(
            'Bạn đã vượt qua 1000 điểm!<br /><br />Sử dụng mã ' +
              coupon +
              '  khi thanh toán để được giảm giá 15%!'
          );
          $('#totalpoints').html(
            'Đã tiêu diệt được ' + kills + ' quái vật mèo!'
          );
        } else {
          $('#message').html(
            'Đạt 1000 điểm để nhận được một phần thưởng bất ngờ!'
          );
          $('#totalpoints').html(
            'Đã tiêu diệt được ' + kills + ' quái vật mèo!'
          );
        }
      }
    } else {
      screen.clearRect(0, 0, gameSize.width, gameSize.height);

      screen.font = '20px Oswald';
      screen.textAlign = 'right';
      screen.fillText(
        'Điểm: ' + kills,
        gameSize.width - 50,
        gameSize.height - 12
      );
      screen.fillText(
        'Mạng: ' + lives,
        gameSize.width - 50,
        gameSize.height - 44
      );
      screen.fillText(
        'Vòng: ' + game.level,
        gameSize.width - 50,
        gameSize.height - 76
      );
    }

    screen.beginPath();

    let i;
    this.player.draw();
    if (!this.lost) {
      screen.fillStyle = '#90C9F4';
      screen.fillStyle = 'white';
      for (i = 0; i < this.meows.length; i++) {
        this.meows[i].draw();
      }
    }
    for (i = 0; i < this.meowShots.length; i++) {
      this.meowShots[i].draw();
    }

    screen.fill();
  },

  meowsBelow: function(meow) {
    return (
      this.meows.filter(function(b) {
        return (
          Math.abs(meow.coordinates.x - b.coordinates.x) === 0 &&
          b.coordinates.y > meow.coordinates.y
        );
      }).length > 0
    );
  }
};
// Meow
const Meow = function(coordinates) {
  this.active = true;
  this.coordinates = coordinates;
  this.size = {
    width: meowSize,
    height: meowSize
  };

  this.patrolX = 0;
  this.speedX = meowSpeed;
};

Meow.prototype = {
  update: function() {
    if (Math.random() > meowAttackRate && !game.meowsBelow(this)) {
      const projectile = new Projectile(
        {
          x: this.coordinates.x + this.size.width / 2,
          y: this.coordinates.y + this.size.height - 5
        },
        {
          x: 0,
          y: 2
        }
      );
      game.meowShots.push(projectile);
    }
  },
  draw: function() {
    if (this.active) {
      screen.drawImage(meowCanvas, this.coordinates.x, this.coordinates.y);
    }
  },
  move: function() {
    if (this.patrolX < 0 || this.patrolX > 100) {
      this.speedX = -this.speedX;
      this.patrolX += this.speedX;
      this.coordinates.y += this.size.height;

      if (this.coordinates.y + this.size.height * 2 > gameSize.height) {
        game.lost = true;
      }
    } else {
      this.coordinates.x += this.speedX;
      this.patrolX += this.speedX;
    }
  },
  destroy: function() {
    this.active = false;
    kills += 1;
  }
};
// Player
const Player = function() {
  this.active = true;
  this.size = {
    width: 16,
    height: 8
  };
  this.shooterHeat = -3;
  screen.fillStyle = '#90C9F4';
  this.coordinates = {
    x: (gameSize.width / 2 - this.size.width / 2) | 0,
    y: gameSize.height - this.size.height * 2
  };

  this.projectile = [];
  this.keyboarder = new KeyController();
};

Player.prototype = {
  update: function() {
    for (let i = 0; i < this.projectile.length; i++) {
      this.projectile[i].update();
    }

    this.projectile = this.projectile.filter(function(projectile) {
      return projectile.active;
    });

    if (!this.active) {
      return;
    }

    if (
      this.keyboarder.isDown(this.keyboarder.KEYS.LEFT) &&
      this.coordinates.x > 0
    ) {
      this.coordinates.x -= 2;
    } else if (
      this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT) &&
      this.coordinates.x < gameSize.width - this.size.width
    )
      this.coordinates.x += 2;

    if (this.keyboarder.isDown(this.keyboarder.KEYS.Space)) {
      this.shooterHeat += 1;
      if (this.shooterHeat < 0) {
        const projectile = new Projectile(
          {
            x: this.coordinates.x + this.size.width / 2 - 1,
            y: this.coordinates.y - 1
          },
          {
            x: 0,
            y: -7
          }
        );
        this.projectile.push(projectile);
      } else if (this.shooterHeat > 12) {
        this.shooterHeat = -3;
      }
    } else {
      this.shooterHeat = -3;
    }
  },
  draw: function() {
    if (this.active) {
      screen.rect(
        this.coordinates.x,
        this.coordinates.y,
        this.size.width,
        this.size.height
      );
      screen.rect(this.coordinates.x - 2, this.coordinates.y + 2, 20, 6);
      screen.rect(this.coordinates.x + 6, this.coordinates.y - 4, 4, 4);
    }

    for (let i = 0; i < this.projectile.length; i++) {
      this.projectile[i].draw();
    }
  },
  destroy: function() {
    if (lives > 0 && colideexecuted === 0) {
      $('#lifelost')
        .fadeIn(70)
        .fadeOut(70)
        .fadeIn(70)
        .fadeOut(200);

      colideexecuted = 1;
      this.active = false;

      setTimeout(function() {
        game.player.active = true;
        game.player.draw();
        colideexecuted = 0;
        lives -= 1;
      }, 500);
    } else {
      this.active = false;
      game.lost = true;
    }
  }
};
// Projectile
const Projectile = function(coordinates, velocity) {
  this.active = true;
  this.coordinates = coordinates;
  this.size = {
    width: 3,
    height: 3
  };
  this.velocity = velocity;
};

Projectile.prototype = {
  update: function() {
    this.coordinates.x += this.velocity.x;
    this.coordinates.y += this.velocity.y;

    if (this.coordinates.y > gameSize.height || this.coordinates.y < 0) {
      this.active = false;
    }
  },
  draw: function() {
    if (this.active) {
      screen.rect(
        this.coordinates.x,
        this.coordinates.y,
        this.size.width,
        this.size.height
      );
    }
  }
};
// Keyboard input tracking
const KeyController = function() {
  this.KEYS = {
    LEFT: 37,
    RIGHT: 39,
    Space: 32
  };
  const keyCode = [37, 39, 32];
  const keyState = {};

  let counter;

  keydownEvent = function(e) {
    for (counter = 0; counter < keyCode.length; counter++) {
      if (keyCode[counter] === e.keyCode) {
        keyState[e.keyCode] = true;
        e.preventDefault();
      }
    }
  };

  window.addEventListener('keydown', keydownEvent);

  keyupEvent = function(e) {
    for (counter = 0; counter < keyCode.length; counter++) {
      if (keyCode[counter] === e.keyCode) {
        keyState[e.keyCode] = false;
        e.preventDefault();
      }
    }
  };

  window.addEventListener('keyup', keyupEvent);

  this.isDown = function(keyCode) {
    return keyState[keyCode] === true;
  };
};
// Other functions
function collides(a, b) {
  return (
    a.coordinates.x < b.coordinates.x + b.size.width &&
    a.coordinates.x + a.size.width > b.coordinates.x &&
    a.coordinates.y < b.coordinates.y + b.size.height &&
    a.coordinates.y + a.size.height > b.coordinates.y
  );
}

function getPixelRow(rowRaw) {
  let placer = 0;
  const textRow = [],
    row = Math.floor(rowRaw / meowMultiplier);
  if (row >= blocks.length) {
    return [];
  }
  for (let i = 0; i < blocks[row].length; i++) {
    const tmpContent = blocks[row][i] * meowMultiplier;
    for (let j = 0; j < meowMultiplier; j++) {
      textRow[placer + j] = tmpContent + j;
    }
    placer += meowMultiplier;
  }
  return textRow;
}

// Write Text
function createMeows() {
  const meows = [];

  let i = blocks.length * meowMultiplier;
  while (i--) {
    const j = getPixelRow(i);
    for (let k = 0; k < j.length; k++) {
      meows.push(
        new Meow({
          x: j[k] * meowSize,
          y: i * meowSize
        })
      );
    }
  }
  return meows;
}

function initGameStart() {
  if (window.innerWidth > 1100) {
    screen.canvas.width = 1200;
    screen.canvas.height = 480;
    gameSize = {
      width: 1200,
      height: 480
    };
    meowMultiplier = 2;
  } else if (window.innerWidth > 800) {
    screen.canvas.width = 900;
    screen.canvas.height = 600;
    gameSize = {
      width: 900,
      height: 600
    };
    meowMultiplier = 1;
  } else {
    screen.canvas.width = 600;
    screen.canvas.height = 300;
    gameSize = {
      width: 600,
      height: 300
    };
    meowMultiplier = 1;
  }

  kills = 0;
  lives = 3;
  meowAttackRate = 0.999;
  meowSpeed = 1;
  spawnDelayCounter = meowSpawnDelay;

  game = new Game();
}

function loop() {
  game.update();
  game.draw();

  meowAnimationFrame = requestAnimationFrame(loop);
}

export default class Page404 extends PureComponent {
  componentDidMount() {
    const meowAsset = new Image();
    meowAsset.onload = function() {
      meowCanvas = document.createElement('canvas');
      meowCanvas.width = meowSize;
      meowCanvas.height = meowSize;
      meowCanvas.getContext('2d').drawImage(meowAsset, 0, 0);

      canvas = document.getElementById('meow-meows');
      screen = canvas.getContext('2d');

      initGameStart();
      loop();
    };
    meowAsset.src = monsterPic;

    restartEvent = function() {
      initGameStart();
    };

    window.addEventListener('resize', restartEvent);

    document.getElementById('restart').addEventListener('click', restartEvent);
    document
      .getElementById('modalrestart')
      .addEventListener('click', restartEvent);
    document
      .getElementById('gameFinished')
      .addEventListener('click', restartEvent);
  }

  componentWillUnmount() {
    cancelAnimationFrame(meowAnimationFrame);
    clearInterval(meowDownTimer);
    document.removeEventListener('resize', restartEvent);
    document.removeEventListener('keyup', keyupEvent);
    document.removeEventListener('keydown', keydownEvent);
    document
      .getElementById('restart')
      .removeEventListener('click', restartEvent);
    document
      .getElementById('modalrestart')
      .removeEventListener('click', restartEvent);
    document
      .getElementById('gameFinished')
      .removeEventListener('click', restartEvent);
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      commonComps: { LazyImage }
    } = Common;

    return (
      <div
        className="wrapper-404"
        style={{ background: `url(${backgroundPic})` }}
      >
        <div className="container-wide micro-padding-bottom">
          <div className="row">
            <div className="col-sm-2">
              <Link to="/">
                <LazyImage
                  className="img-responsive"
                  src={logoPic}
                  alt="bobia-logo"
                />
              </Link>
            </div>
            <div className="textalignright col-sm-10">
              <h1 className="textalignright white-text">
                404 - Page Not Found
              </h1>
              <p className="textalignright">
                Sử dụng <span className="badge badge-danger">phím Space</span>{' '}
                để bắn và <span className="badge badge-danger">←</span>&#160;
                <span className="badge badge-danger">→</span> để di
                chuyển!&#160;&#160;&#160;
                <button className="btn btn-default btn-xs" id="restart">
                  Chơi lại
                </button>
              </p>
            </div>
          </div>

          <div style={{ paddingBottom: '30px' }}>
            <div className="col-sm-12">
              <h2
                style={{ color: '#c2ff66', fontSize: '40px' }}
                className="center"
              >
                Trang bạn truy cập đã bị lũ quái vật mèo đánh sập! Hãy báo thù!
              </h2>
              <h3 className="textaligncenter white-text">
                <span id="go-back" onClick={this.goBack}>
                  (Hoặc quay về trang trước...)
                </span>
              </h3>
            </div>
          </div>
        </div>

        <div id="lifelost" />
        <div id="levelup">
          <h1 className="textaligncenter white-text big-text">Chúc mừng!</h1>
          <h2 className="textaligncenter white-text">
            Bạn đã được cộng thêm một mạng. Chuẩn bị cho vòng tiếp theo nào...
          </h2>
        </div>

        <canvas id="meow-meows" />
        <div id="gameFinished" className="modal fade" role="dialog">
          <div className="modal-dialog textaligncenter">
            <h1 className="textaligncenter white-text big-text">
              Hoạ mi đã nghoẻo!
            </h1>
            <h3
              className="small-padding-bottom white-text textaligncenter"
              id="totalpoints"
            >
              0
            </h3>
            <h2 className="white-text textaligncenter" id="message">
              Đạt 1000 điểm để nhận được một phần thưởng bất ngờ!
            </h2>
            <p className="textaligncenter">
              <button
                type="button"
                id="modalrestart"
                className="button-main button-large aligncenter textaligncenter"
                data-dismiss="modal"
              >
                Chơi lại
              </button>
              <Link
                className="button-main button-large aligncenter textaligncenter go-home"
                to="/"
                onClick={() => $('#gameFinished').modal('hide')}
              >
                Trang chủ
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
