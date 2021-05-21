import me from "melonjs";

export const registerEnemyManager = (game) => {
  game.EnemyManager = me.Container.extend({
    init: function () {
      this._super(me.Container, "init", [
        32,
        32,
        this.COLS * 64 - 32,
        this.ROWS * 64 - 32,
      ]);
      this.COLS = 9;
      this.ROWS = 4;
      this.vel = 10 + (10 ** (game.data.game_count / 10) - 1);
      console.info("Enemy Velocity at: " + this.vel);
      this.createdEnemies = false;

      this.onChildChange = function () {
        this.updateChildBounds();

        if (this.children.length === 0 && this.createdEnemies) {
          game.playScreen.handleWin();
        }
      };
    },

    createEnemies: function () {
      for (var i = 0; i < this.COLS; i++) {
        for (var j = 0; j < this.ROWS; j++) {
          this.addChild(me.pool.pull("enemy", i * 64, j * 64));
        }
      }
      this.createdEnemies = true;
    },

    update: function (time) {
      this._super(me.Container, "update", [time]);
      this.updateChildBounds();
    },

    onActivateEvent: function () {
      var _this = this;
      this.timer = me.timer.setInterval(function () {
        var bounds = _this.childBounds;

        if (
          (_this.vel > 0 &&
            bounds.right + _this.vel >= me.game.viewport.width) ||
          (_this.vel < 0 && bounds.left + _this.vel <= 0)
        ) {
          _this.vel *= -1;
          _this.pos.y += 16;
          if (_this.vel > 0) {
            _this.vel += 0.25;
          } else {
            _this.vel -= 0.25;
          }
          game.playScreen.checkIfLoss(bounds.bottom);
        } else {
          _this.pos.x += _this.vel;
        }
      }, 1000 / me.timer.maxfps / 2);
    },

    onDeactivateEvent: function () {
      me.timer.clearInterval(this.timer);
    },
  });
};
