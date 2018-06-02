(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = SupEngine.THREE;
var P2Body = /** @class */ (function (_super) {
    __extends(P2Body, _super);
    function P2Body(actor) {
        var _this = _super.call(this, actor, "P2Body") || this;
        _this.actorPosition = new THREE.Vector3();
        _this.actorAngles = new THREE.Euler();
        _this.body = new window.p2.Body();
        SupEngine.P2.world.addBody(_this.body);
        return _this;
    }
    P2Body.prototype.setIsLayerActive = function (active) { };
    P2Body.prototype.setup = function (config) {
        this.mass = (config.mass != null) ? config.mass : 0;
        this.fixedRotation = (config.fixedRotation != null) ? config.fixedRotation : false;
        this.offsetX = (config.offsetX != null) ? config.offsetX : 0;
        this.offsetY = (config.offsetY != null) ? config.offsetY : 0;
        this.actor.getGlobalPosition(this.actorPosition);
        this.actor.getGlobalEulerAngles(this.actorAngles);
        this.body.mass = this.mass;
        this.body.type = (this.mass === 0) ? window.p2.Body.STATIC : window.p2.Body.DYNAMIC;
        this.body.material = SupEngine.P2.world.defaultMaterial;
        this.body.fixedRotation = this.fixedRotation;
        this.body.updateMassProperties();
        this.shape = config.shape;
        switch (this.shape) {
            case "box":
                {
                    this.width = (config.width != null) ? config.width : 0.5;
                    this.height = (config.height != null) ? config.height : 0.5;
                    this.angle = (config.angle != null) ? config.angle * (Math.PI / 180) : 0;
                    this.body.addShape(new window.p2.Box({ width: this.width, height: this.height }));
                }
                break;
            case "circle":
                {
                    this.radius = (config.radius != null) ? config.radius : 1;
                    this.angle = 0;
                    this.body.addShape(new window.p2.Circle({ radius: this.radius }));
                }
                break;
        }
        this.body.position = [this.actorPosition.x, this.actorPosition.y];
        this.body.shapes[0].position = [this.offsetX, this.offsetY];
        this.body.angle = this.actorAngles.z + this.angle;
    };
    P2Body.prototype.update = function () {
        this.actorPosition.x = this.body.position[0];
        this.actorPosition.y = this.body.position[1];
        this.actor.setGlobalPosition(this.actorPosition);
        this.actorAngles.z = this.body.angle - this.angle;
        this.actor.setGlobalEulerAngles(this.actorAngles);
    };
    P2Body.prototype._destroy = function () {
        SupEngine.P2.world.removeBody(this.body);
        this.body = null;
        _super.prototype._destroy.call(this);
    };
    return P2Body;
}(SupEngine.ActorComponent));
exports.default = P2Body;

},{}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var P2BodyMarkerUpdater_1 = require("./P2BodyMarkerUpdater");
var THREE = SupEngine.THREE;
var tmpVector3 = new THREE.Vector3();
var tmpEulerAngles = new THREE.Euler();
var P2BodyMarker = /** @class */ (function (_super) {
    __extends(P2BodyMarker, _super);
    function P2BodyMarker(actor) {
        var _this = _super.call(this, actor, "P2BodyMarker") || this;
        _this.offset = new THREE.Vector3(0, 0, 0);
        _this.angle = 0;
        _this.markerActor = new SupEngine.Actor(_this.actor.gameInstance, "Marker", null, { layer: -1 });
        return _this;
    }
    P2BodyMarker.prototype.setIsLayerActive = function (active) {
        if (this.mesh != null)
            this.mesh.visible = active;
    };
    P2BodyMarker.prototype.update = function () {
        _super.prototype.update.call(this);
        this.actor.getGlobalPosition(tmpVector3);
        this.markerActor.setGlobalPosition(tmpVector3);
        this.actor.getGlobalEulerAngles(tmpEulerAngles);
        tmpEulerAngles.x = tmpEulerAngles.y = 0;
        tmpEulerAngles.z += this.angle;
        this.markerActor.setGlobalEulerAngles(tmpEulerAngles);
    };
    P2BodyMarker.prototype.setBox = function (width, height) {
        if (this.mesh != null)
            this._clearRenderer();
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-width / 2, -height / 2, 0), new THREE.Vector3(width / 2, -height / 2, 0), new THREE.Vector3(width / 2, height / 2, 0), new THREE.Vector3(-width / 2, height / 2, 0), new THREE.Vector3(-width / 2, -height / 2, 0));
        var material = new THREE.LineBasicMaterial({ color: 0xf459e4 });
        this.mesh = new THREE.Line(geometry, material);
        this.markerActor.threeObject.add(this.mesh);
        this.mesh.position.copy(this.offset);
        this.mesh.updateMatrixWorld(false);
    };
    P2BodyMarker.prototype.setCircle = function (radius) {
        if (this.mesh != null)
            this._clearRenderer();
        var geometry = new THREE.CircleGeometry(radius, 16);
        var material = new THREE.MeshBasicMaterial({ color: 0xf459e4, wireframe: true });
        this.mesh = new THREE.Mesh(geometry, material);
        this.markerActor.threeObject.add(this.mesh);
        this.mesh.position.copy(this.offset);
        this.mesh.updateMatrixWorld(false);
    };
    P2BodyMarker.prototype.setOffset = function (xOffset, yOffset) {
        this.offset.set(xOffset, yOffset, 0);
        this.mesh.position.copy(this.offset);
        this.mesh.updateMatrixWorld(false);
    };
    P2BodyMarker.prototype.setAngle = function (angle) {
        this.angle = angle * (Math.PI / 180);
    };
    P2BodyMarker.prototype._clearRenderer = function () {
        this.markerActor.threeObject.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.mesh = null;
    };
    P2BodyMarker.prototype._destroy = function () {
        if (this.mesh != null)
            this._clearRenderer();
        this.actor.gameInstance.destroyActor(this.markerActor);
        _super.prototype._destroy.call(this);
    };
    /* tslint:disable:variable-name */
    P2BodyMarker.Updater = P2BodyMarkerUpdater_1.default;
    return P2BodyMarker;
}(SupEngine.ActorComponent));
exports.default = P2BodyMarker;

},{"./P2BodyMarkerUpdater":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var P2BodyMarkerUpdater = /** @class */ (function () {
    function P2BodyMarkerUpdater(client, bodyRenderer, config) {
        this.bodyRenderer = bodyRenderer;
        this.config = config;
        switch (this.config.shape) {
            case "box":
                {
                    this.bodyRenderer.setBox(this.config.width, this.config.height);
                }
                break;
            case "circle":
                {
                    this.bodyRenderer.setCircle(this.config.radius);
                }
                break;
        }
        this.bodyRenderer.setOffset(this.config.offsetX, this.config.offsetY);
        this.bodyRenderer.setAngle(this.config.angle);
    }
    P2BodyMarkerUpdater.prototype.destroy = function () { };
    P2BodyMarkerUpdater.prototype.config_setProperty = function (path, value) {
        if (path === "width" || path === "height" || (path === "shape" && value === "box")) {
            this.bodyRenderer.setBox(this.config.width, this.config.height);
        }
        if (path === "radius" || (path === "shape" && value === "circle")) {
            this.bodyRenderer.setCircle(this.config.radius);
        }
        if (path === "offsetX" || path === "offsetY") {
            this.bodyRenderer.setOffset(this.config.offsetX, this.config.offsetY);
        }
        if (path === "angle") {
            this.bodyRenderer.setAngle(this.config.angle);
        }
    };
    return P2BodyMarkerUpdater;
}());
exports.default = P2BodyMarkerUpdater;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var P2Body_1 = require("./P2Body");
var P2BodyMarker_1 = require("./P2BodyMarker");
SupEngine.registerComponentClass("P2Body", P2Body_1.default);
SupEngine.registerEditorComponentClass("P2BodyMarker", P2BodyMarker_1.default);

},{"./P2Body":1,"./P2BodyMarker":2}]},{},[4]);
