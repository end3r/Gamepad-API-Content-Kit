
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function() {
  var axesStatus, checkButtons, checkForGamePad, listeners, pad, padStatus;
  listeners = {};
  window.gamepad = {
    isSupported: function() {
      var gamepads;
      gamepads = navigator.webkitGetGamepads || navigator.mozGetGamepads || navigator.getGamepads;
      return gamepads !== void 0;
    },
    get: function(index) {
      if (index != null) {
        return gamepad.getAll()[index];
      }
      return gamepad.getAll();
    },
    getAll: function() {
      if (!gamepad.isSupported()) {
        return;
      }
      return navigator.getGamepads();
    },
    BUTTONS: {
      face1: 0,
      face2: 1,
      face3: 2,
      face4: 3,
      leftShoulder: 4,
      rightShoulder: 5,
      leftShoulderBottom: 6,
      rightShoulderBottom: 7,
      select: 8,
      start: 9,
      leftStick: 10,
      rightStick: 11,
      up: 12,
      down: 13,
      left: 14,
      right: 15
    },
    AXES: {
      leftStickX: 0,
      leftStickY: 1,
      rightStickX: 2,
      rightStickY: 3
    },
    on: function(event, callback) {
      var _ref;
            if ((_ref = listeners[event]) != null) {
        _ref;
      } else {
        listeners[event] = [];
      };
      return listeners[event].push(callback);
    },
    fire: function(event, data) {
      var callback, events, list, _i, _len, _results;
            if (data != null) {
        data;
      } else {
        data = {};
      };
      list = event.split(":");
      events = [event, list[1], list[1] + ":" + list[2], list[0] + list[1]];
      _results = [];
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        _results.push((function() {
          var _j, _len2, _ref, _results2;
          if (listeners[event] != null) {
            _ref = listeners[event];
            _results2 = [];
            for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
              callback = _ref[_j];
              data.event = event;
              data.button = list[2];
              data.state = {
                pad: padStatus,
                axes: axesStatus
              };
              _results2.push(callback(data));
            }
            return _results2;
          }
        })());
      }
      return _results;
    }
  };
  for (pad = 0; pad <= 3; pad++) {
    gamepad[pad] = {
      on: function(event, callback) {
        return gamepad.on("" + pad + ":" + event, callback);
      }
    };
  }
  checkForGamePad = null;
  padStatus = [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]];
  axesStatus = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  checkButtons = function() {
    var data, event, index, name, normalized, padNumber, _ref, _ref2;
    for (padNumber = 0; padNumber <= 3; padNumber++) {
      pad = gamepad.get(padNumber);
      if (pad !== void 0) {
        _ref = gamepad.BUTTONS;
        for (name in _ref) {
          index = _ref[name];
          if (padStatus[padNumber][index][0] !== pad.buttons[index]) {
            padStatus[padNumber][index][0] = pad.buttons[index];
            normalized = pad.buttons[index] > 1 - 0.07 ? 1 : 0;
            data = {
              value: pad.buttons[index],
              normalizedValue: normalized,
              pad: padNumber
            };
            if (normalized !== padStatus[padNumber][index][1]) {
              padStatus[padNumber][index][1] = normalized;
              event = normalized === 1 ? "press" : "release";
              gamepad.fire("" + padNumber + ":" + event + ":" + name, data);
            }
            gamepad.fire("" + padNumber + ":change:" + name, data);
          }
        }
        _ref2 = gamepad.AXES;
        for (name in _ref2) {
          index = _ref2[name];
          if (0.07 < Math.abs(axesStatus[padNumber][index] - pad.axes[index])) {
            axesStatus[padNumber][index] = pad.axes[index];
            data = {
              value: pad.axes[index],
              pad: padNumber
            };
            gamepad.fire("" + padNumber + ":change:" + name, data);
          }
        }
      }
    }
    return requestAnimationFrame(checkButtons);
  };
  checkForGamePad = function() {
    pad = gamepad.get(0);
    if (pad != null) {
      console.log("setting up gamepad");
      requestAnimationFrame(checkButtons);
      return gamepad.fire("ready", {});
    } else {
      console.log("next");
      return setTimeout(checkForGamePad, 1000);
    }
  };
  gamepad.init = function(callback) {
    if (callback != null) {
      gamepad.on("ready", callback);
    }
    return checkForGamePad();
  };
}).call(this);

gamepad.init();
gamepad.on("press:rightShoulder", Reveal.navigateNext);
gamepad.on("press:rightShoulderBottom", Reveal.navigatePrev);
gamepad.on("press:leftShoulder", Reveal.navigateNext);
gamepad.on("press:leftShoulderBottom", Reveal.navigatePrev);