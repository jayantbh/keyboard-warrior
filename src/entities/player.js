import me from "melonjs";

export const registerPlayer = (game) => {
  game.Player = me.Sprite.extend({
    init: function () {
      var image = me.loader.getImage("player");
      this._super(me.Sprite, "init", [
        me.game.viewport.width / 2,
        me.game.viewport.height - image.height - 20,
        { image: image },
      ]);
      this.velx = 450;
      this.maxX = me.game.viewport.width - this.width;
      this.minX = this.width;
    },
    move(direction) {
      switch (direction) {
        case "left": {
          this.pos.x -= this.width;
          break;
        }
        case "right": {
          this.pos.x += this.width;
          break;
        }
        default:
          break;
      }
    },
    shoot() {
      me.game.world.addChild(
        me.pool.pull(
          "laser",
          this.pos.x - game.Laser.width / 2,
          this.pos.y - game.Laser.height
        )
      );
      me.audio.play("laser");
    },
    update: function (time) {
      this._super(me.Sprite, "update", [time]);

      this.pos.x = me.Math.clamp(this.pos.x, this.minX, this.maxX);

      return true;
    },
  });

  me.pool.register("player", game.Player);
};
