import me from "melonjs";

export const registerTitleScreen = (game) => {
  game.TitleScreen = me.Stage.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function () {
      // TODO

      me.game.world.addChild(new me.ColorLayer("background", "#e0e0e0"));
      let img = new me.ImageLayer(
        // me.game.viewport.width / 2,
        // me.game.viewport.height / 2,
        0,
        0,
        {
          image: "splash",
          anchorPoint: new me.Vector2d(0.5, 0.5),
          repeat: "no-repeat",
        }
      );
      img.pos.set(
        (me.game.viewport.width - img.imagewidth) / 2,
        (me.game.viewport.height - img.imageheight) / 2
      );
      me.game.world.addChild(img);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function () {
      // TODO
    },
  });
};
