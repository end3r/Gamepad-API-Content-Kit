var buttonPrevState = false;
var buttonNextState = false;
var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;
function connecthandler(e) {
  console.log('Gamepad connected');
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  rAF(updateStatus);
}
function disconnecthandler(e) {
  removegamepad(e.gamepad);
}
function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}
function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }
  for (j in controllers) {
    var controller = controllers[j];
    for (var i=0; i<controller.buttons.length; i++) {
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
      if (pressed) {
        if(i == 11 && !buttonNextState) { // 5
          console.log('button next pressed');
          buttonNextState = true;
          Reveal.next();
        }
        else if(i == 12 && !buttonPrevState) { // 1
          console.log('button prev pressed');
          buttonPrevState = true;
          Reveal.prev();
        }
      } else {
        if(i == 11 && buttonNextState) { // 5
          console.log('button next released');
          buttonNextState = false;
        }
        else if(i == 12 && buttonPrevState) { // 1
          console.log('button prev released');
          buttonPrevState = false;
        }
      }
    }
  }
  rAF(updateStatus);
}
function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}
window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);
if (!haveEvents) {
  setInterval(scangamepads, 500);
}