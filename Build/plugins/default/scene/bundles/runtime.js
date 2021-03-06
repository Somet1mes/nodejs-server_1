(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setupComponent(player, component, config) {
    component.setOrthographicMode(config.mode === "orthographic");
    component.setFOV(config.fov);
    component.setOrthographicScale(config.orthographicScale);
    component.setDepth(config.depth);
    component.setNearClippingPlane(config.nearClippingPlane);
    component.setFarClippingPlane(config.farClippingPlane);
    component.setViewport(config.viewport.x, config.viewport.y, config.viewport.width, config.viewport.height);
}
exports.setupComponent = setupComponent;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Camera = require("./Camera");
var scene = require("./scene");
SupRuntime.registerPlugin("Camera", Camera);
SupRuntime.registerPlugin("scene", scene);

},{"./Camera":1,"./scene":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadAsset(player, entry, callback) {
    player.getAssetData("assets/" + entry.storagePath + "/scene.json", "json", callback);
}
exports.loadAsset = loadAsset;
function createOuterAsset(player, asset) {
    return new window.Sup.Scene(asset);
}
exports.createOuterAsset = createOuterAsset;

},{}]},{},[2]);
