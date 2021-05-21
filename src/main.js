import io from "socket.io/client-dist/socket.io";
import me from "melonjs";

import { game } from "./game";
import { registerPlayScreen } from "./screens/play";
import { registerTitleScreen } from "./screens/title";
import { registerHUD } from "./entities/HUD";
import { registerPlayerEntity } from "./entities/entities";
import { registerPlayer } from "./entities/player";
import { registerEnemy } from "./entities/enemy";
import { registerLaser } from "./entities/laser";
import { registerEnemyManager } from "./managers/enemy";

window.onload = () => {
  let socket = io();
  console.info("Loaded!", socket);

  registerPlayScreen(game, socket);
  registerTitleScreen(game);
  registerHUD(game);
  registerPlayerEntity(game);
  registerPlayer(game);
  registerEnemy(game);
  registerLaser(game);
  registerEnemyManager(game);

  me.device.onReady(function onReady() {
    game.onload();
  });
};
