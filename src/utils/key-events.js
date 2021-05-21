/**
 * Callback receives pressed Key and KeyDown event.
 * @callback keydownCallback
 * @param {string} key
 * @param {Event} e
 */

/**
 * @param {keydownCallback} callback
 */

export const handleKeyPress = (callback) => {
  const pressedKeyMap = {};
  const onKeyDown = (e) => {
    if (pressedKeyMap[e.key]) return;
    pressedKeyMap[e.key] = true;
    callback(e.key, e);
  };
  const onKeyUp = (e) => {
    delete pressedKeyMap[e.key];
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return () => {
    console.log("Handler removed");
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
};
