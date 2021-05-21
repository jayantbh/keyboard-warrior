import me from "melonjs";
import { handleKeyPress } from "../utils/key-events";

const LAG_THRESHOLD = 100;

const KEYS = {
  ArrowRight: "Right",
  d: "Right",
  ArrowLeft: "Left",
  a: "Left",
  " ": "Space",
};

const updateActionsList = (key) => {
  const li = document.createElement("li");
  li.innerText = KEYS[key] || key;
  if (KEYS[key]) li.classList.add("recognized");

  const actionsList = document.getElementById("actions-list");

  if (actionsList.childElementCount > 20) {
    actionsList.firstChild.remove();
  }
  actionsList.appendChild(li);
};

export const registerPlayScreen = (game, socket) => {
  game.PlayScreen = me.Stage.extend({
    init() {
      this._super(me.Stage, "init");
      this.socketEvents = this._socketEvents.bind(this);
    },
    checkIfLoss: function (y) {
      if (y >= this.player.pos.y - this.player.height) {
        this.enemyManager.createdEnemies = false;
        me.audio.play("game-over");

        game.data.game_count = 0;
        game.data.score = 0;
        this.reset();
      }
    },
    handleWin() {
      console.log("Win!");
      game.data.game_count++;
      this.reset();
    },

    _socketEvents(key, time) {
      const delay = new Date().getTime() - time;
      console.log(key, "from socket", delay);
      if (delay > LAG_THRESHOLD)
        console.warn(
          "You're experiencing latencies greater than 100ms, this could affect your gameplay experience."
        );

      updateActionsList(key);

      switch (key) {
        case "ArrowRight":
        case "d": {
          this.player.move("right");
          break;
        }
        case "ArrowLeft":
        case "a": {
          this.player.move("left");
          break;
        }
        case " ": {
          this.player.shoot();
        }
      }
    },

    /**
     *  action to perform on state change
     */
    onResetEvent: function () {
      this.background = new me.ColorLayer("background", "#e0e0e0");
      me.game.world.addChild(this.background, 0);
      this.player = me.pool.pull("player");
      me.game.world.addChild(this.player, 1);
      this.enemyManager = new game.EnemyManager();
      this.enemyManager.createEnemies();
      me.game.world.addChild(this.enemyManager, 2);

      console.log(this.player);

      // me.input.bindKey(me.input.KEY.LEFT, "left");
      // me.input.bindKey(me.input.KEY.RIGHT, "right");
      // me.input.bindKey(me.input.KEY.A, "left");
      // me.input.bindKey(me.input.KEY.D, "right");
      // me.input.bindKey(me.input.KEY.SPACE, "shoot", true);

      this.removeKeyPressHandler?.();
      this.removeKeyPressHandler = handleKeyPress((key) => {
        console.log(key);
        socket.emit("keypress", key);
      });

      socket.off("keypress", this.socketEvents);
      socket.on("keypress", this.socketEvents);

      // // Add our HUD to the game world, add it last so that this is on top of the rest.
      // // Can also be forced by specifying a "Infinity" z value to the addChild function.
      this.HUD = new game.HUD.Container();
      me.game.world.addChild(this.HUD);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function () {
      // remove the HUD from the game world
      me.game.world.removeChild(this.HUD);

      // me.input.unbindKey(me.input.KEY.LEFT);
      // me.input.unbindKey(me.input.KEY.RIGHT);
      // me.input.unbindKey(me.input.KEY.A);
      // me.input.unbindKey(me.input.KEY.D);
      // me.input.unbindKey(me.input.KEY.SPACE);

      this.removeKeyPressHandler();

      socket.off("keypress", this.socketEvents);
    },
  });
};
