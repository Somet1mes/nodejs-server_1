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
var CannonBody = /** @class */ (function (_super) {
    __extends(CannonBody, _super);
    function CannonBody(actor) {
        var _this = _super.call(this, actor, "CannonBody") || this;
        _this.actorPosition = new THREE.Vector3();
        _this.actorOrientation = new THREE.Quaternion();
        _this.body = new window.CANNON.Body();
        SupEngine.Cannon.World.addBody(_this.body);
        return _this;
    }
    CannonBody.prototype.setIsLayerActive = function (active) { };
    CannonBody.prototype.setup = function (config) {
        this.mass = config.mass != null ? config.mass : 0;
        this.fixedRotation = config.fixedRotation != null ? config.fixedRotation : false;
        this.positionOffset = config.positionOffset != null ? config.positionOffset : { x: 0, y: 0, z: 0 };
        this.group = config.group != null ? config.group : 1;
        this.mask = config.mask != null ? config.mask : 1;
        this.actor.getGlobalPosition(this.actorPosition);
        this.actor.getGlobalOrientation(this.actorOrientation);
        this.body.mass = this.mass;
        this.body.type = this.mass === 0 ? window.CANNON.Body.STATIC : window.CANNON.Body.DYNAMIC;
        this.body.material = SupEngine.Cannon.World.defaultMaterial;
        this.body.fixedRotation = this.fixedRotation;
        this.body.collisionFilterGroup = this.group;
        this.body.collisionFilterMask = this.mask;
        this.body.updateMassProperties();
        if (config.orientationOffset != null) {
            this.orientationOffset = {
                x: THREE.Math.degToRad(config.orientationOffset.x),
                y: THREE.Math.degToRad(config.orientationOffset.y),
                z: THREE.Math.degToRad(config.orientationOffset.z)
            };
        }
        else {
            this.orientationOffset = { x: 0, y: 0, z: 0 };
        }
        this.shape = config.shape;
        switch (this.shape) {
            case "box":
                this.halfSize = config.halfSize != null ? config.halfSize : { x: 0.5, y: 0.5, z: 0.5 };
                this.body.addShape(new window.CANNON.Box(new window.CANNON.Vec3().copy(this.halfSize)));
                break;
            case "sphere":
                this.radius = config.radius != null ? config.radius : 1;
                this.body.addShape(new window.CANNON.Sphere(this.radius));
                break;
            case "cylinder":
                this.radius = config.radius != null ? config.radius : 1;
                this.height = config.height != null ? config.height : 1;
                this.segments = config.segments != null ? config.segments : 16;
                this.body.addShape(new window.CANNON.Cylinder(this.radius, this.radius, this.height, this.segments));
                break;
        }
        this.body.position.set(this.actorPosition.x, this.actorPosition.y, this.actorPosition.z);
        this.body.shapeOffsets[0].copy(this.positionOffset);
        this.body.shapeOrientations[0].setFromEuler(this.orientationOffset.x, this.orientationOffset.y, this.orientationOffset.z);
        this.body.quaternion.set(this.actorOrientation.x, this.actorOrientation.y, this.actorOrientation.z, this.actorOrientation.w);
    };
    CannonBody.prototype.update = function () {
        this.actorPosition.set(this.body.position.x, this.body.position.y, this.body.position.z);
        this.actor.setGlobalPosition(this.actorPosition);
        this.actorOrientation.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
        this.actor.setGlobalOrientation(this.actorOrientation);
    };
    CannonBody.prototype._destroy = function () {
        SupEngine.Cannon.World.remove(this.body);
        this.body = null;
        _super.prototype._destroy.call(this);
    };
    return CannonBody;
}(SupEngine.ActorComponent));
exports.default = CannonBody;

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
var CannonBodyMarkerUpdater_1 = require("./CannonBodyMarkerUpdater");
var THREE = SupEngine.THREE;
var tmpVector3 = new THREE.Vector3();
var tmpEulerAngles = new THREE.Euler();
var CannonBodyMarker = /** @class */ (function (_super) {
    __extends(CannonBodyMarker, _super);
    function CannonBodyMarker(actor) {
        var _this = _super.call(this, actor, "CannonBodyMarker") || this;
        _this.markerActor = new SupEngine.Actor(_this.actor.gameInstance, "Marker", null, { layer: -1 });
        return _this;
    }
    CannonBodyMarker.prototype.setIsLayerActive = function (active) { if (this.mesh != null)
        this.mesh.visible = active; };
    CannonBodyMarker.prototype.update = function () {
        _super.prototype.update.call(this);
        this.actor.getGlobalPosition(tmpVector3);
        this.markerActor.setGlobalPosition(tmpVector3);
        this.actor.getGlobalEulerAngles(tmpEulerAngles);
        this.markerActor.setGlobalEulerAngles(tmpEulerAngles);
    };
    CannonBodyMarker.prototype.setBox = function (orientationOffset, halfSize) {
        if (this.mesh != null)
            this._clearRenderer();
        var geometry = new THREE.BoxGeometry(halfSize.x * 2, halfSize.y * 2, halfSize.z * 2);
        var material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xf459e4, transparent: true, opacity: 0.2 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.quaternion.setFromEuler(new THREE.Euler(THREE.Math.degToRad(orientationOffset.x), THREE.Math.degToRad(orientationOffset.y), THREE.Math.degToRad(orientationOffset.z)));
        this.markerActor.threeObject.add(this.mesh);
        this.mesh.updateMatrixWorld(false);
    };
    CannonBodyMarker.prototype.setSphere = function (radius) {
        if (this.mesh != null)
            this._clearRenderer();
        var geometry = new THREE.SphereGeometry(radius);
        var material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xf459e4, transparent: true, opacity: 0.2 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.markerActor.threeObject.add(this.mesh);
        this.mesh.updateMatrixWorld(false);
    };
    CannonBodyMarker.prototype.setCylinder = function (orientationOffset, radius, height, segments) {
        if (this.mesh != null)
            this._clearRenderer();
        var geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
        var material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xf459e4, transparent: true, opacity: 0.2 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.quaternion.setFromEuler(new THREE.Euler(THREE.Math.degToRad((orientationOffset.x + 90)), THREE.Math.degToRad(orientationOffset.y), THREE.Math.degToRad(orientationOffset.z)));
        this.markerActor.threeObject.add(this.mesh);
        this.mesh.updateMatrixWorld(false);
    };
    CannonBodyMarker.prototype.setPositionOffset = function (positionOffset) {
        this.mesh.position.copy(positionOffset);
        this.mesh.updateMatrixWorld(false);
    };
    CannonBodyMarker.prototype._clearRenderer = function () {
        this.markerActor.threeObject.remove(this.mesh);
        this.mesh.traverse(function (obj) {
            if (obj.dispose != null)
                obj.dispose();
        });
        this.mesh = null;
    };
    CannonBodyMarker.prototype._destroy = function () {
        if (this.mesh != null)
            this._clearRenderer();
        _super.prototype._destroy.call(this);
    };
    /* tslint:disable:variable-name */
    CannonBodyMarker.Updater = CannonBodyMarkerUpdater_1.default;
    return CannonBodyMarker;
}(SupEngine.ActorComponent));
exports.default = CannonBodyMarker;

},{"./CannonBodyMarkerUpdater":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CannonBodyMarkerUpdater = /** @class */ (function () {
    function CannonBodyMarkerUpdater(client, bodyRenderer, config) {
        this.client = client;
        this.bodyRenderer = bodyRenderer;
        this.config = config;
        switch (this.config.shape) {
            case "box":
                this.bodyRenderer.setBox(this.config.orientationOffset, this.config.halfSize);
                break;
            case "sphere":
                this.bodyRenderer.setSphere(this.config.radius);
                break;
            case "cylinder":
                this.bodyRenderer.setCylinder(this.config.orientationOffset, this.config.radius, this.config.height, this.config.segments);
                break;
        }
        this.bodyRenderer.setPositionOffset(this.config.positionOffset);
    }
    CannonBodyMarkerUpdater.prototype.destroy = function () { };
    CannonBodyMarkerUpdater.prototype.config_setProperty = function (path, value) {
        if ((path.indexOf("orientationOffset") !== -1 && this.config.shape === "box") || path.indexOf("halfSize") !== -1 || (path === "shape" && value === "box")) {
            this.bodyRenderer.setBox(this.config.orientationOffset, this.config.halfSize);
            this.bodyRenderer.setPositionOffset(this.config.positionOffset);
        }
        if ((path === "radius" && this.config.shape === "sphere") || (path === "shape" && value === "sphere")) {
            this.bodyRenderer.setSphere(this.config.radius);
            this.bodyRenderer.setPositionOffset(this.config.positionOffset);
        }
        if ((path.indexOf("orientationOffset") !== -1 && this.config.shape === "cylinder") ||
            (path === "radius" && this.config.shape === "cylinder") ||
            (path === "shape" && value === "cylinder") || path === "height" || path === "segments") {
            this.bodyRenderer.setCylinder(this.config.orientationOffset, this.config.radius, this.config.height, this.config.segments);
            this.bodyRenderer.setPositionOffset(this.config.positionOffset);
        }
        if (path.indexOf("positionOffset") !== -1) {
            this.bodyRenderer.setPositionOffset(this.config.positionOffset);
        }
    };
    return CannonBodyMarkerUpdater;
}());
exports.default = CannonBodyMarkerUpdater;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CannonBody_1 = require("./CannonBody");
var CannonBodyMarker_1 = require("./CannonBodyMarker");
SupEngine.registerComponentClass("CannonBody", CannonBody_1.default);
SupEngine.registerEditorComponentClass("CannonBodyMarker", CannonBodyMarker_1.default);

},{"./CannonBody":1,"./CannonBodyMarker":2}]},{},[4]);
