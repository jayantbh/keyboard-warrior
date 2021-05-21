import me from "melonjs";

const SCALE = 1.5;

const SCREEN_X = 800 * SCALE;
const SCREEN_Y = 600 * SCALE;

export const game = {
  data: {
    score: 0,
    game_count: 0,
  },

  onload: function () {
    if (
      !me.video.init(SCREEN_X, SCREEN_Y, {
        parent: "screen",
        scale: "auto",
        scaleMethod: "flex-max",
        antiAlias: true,
      })
    ) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    if (!me.audio.init("wav")) {
      console.log("Audio failed to init");
    } else {
      me.audio.setVolume(0.4);
    }

    me.sys.pauseOnBlur = false;

    me.state.set(me.state.LOADING, new game.TitleScreen());
    me.loader.load(
      { name: "splash", type: "image", src: "assets/title-screen.png" },
      () => {
        me.loader.preload(game.resources, this.loaded.bind(this));
      }
    );
  },

  loaded: function () {
    this.playScreen = new game.PlayScreen();
    me.state.set(me.state.PLAY, this.playScreen);

    // start the game
    me.state.change(me.state.PLAY);
  },
};

game.resources = [
  { name: "player", type: "image", src: "./assets/keyboard.png" },
  { name: "ships", type: "image", src: "./assets/enemy.png" },
  { name: "laser", type: "audio", src: "./assets/" },
  { name: "game-over", type: "audio", src: "./assets/" },
  { name: "PressStart2P", type: "image", src: "/assets/PressStart2P.png" },
  {
    name: "PressStart2PGrey",
    type: "image",
    src: "/assets/PressStart2PGrey.png",
  },
  { name: "PressStart2P", type: "binary", src: "/assets/PressStart2P.fnt" },
];
