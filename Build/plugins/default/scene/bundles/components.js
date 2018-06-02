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
var CameraUpdater_1 = require("./CameraUpdater");
var CameraMarker = /** @class */ (function (_super) {
    __extends(CameraMarker, _super);
    function CameraMarker(actor) {
        var _this = _super.call(this, actor, "Marker") || this;
        _this.viewport = { x: 0, y: 0, width: 1, height: 1 };
        _this.projectionNeedsUpdate = true;
        var geometry = new THREE.Geometry();
        for (var i = 0; i < 24; i++)
            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        _this.line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true }));
        _this.actor.threeObject.add(_this.line);
        _this.line.updateMatrixWorld(false);
        return _this;
    }
    CameraMarker.prototype.setIsLayerActive = function (active) { this.line.visible = active; };
    CameraMarker.prototype.setConfig = function (config) {
        this.setOrthographicMode(config.mode === "orthographic");
        this.setFOV(config.fov);
        this.setOrthographicScale(config.orthographicScale);
        this.setViewport(config.viewport.x, config.viewport.y, config.viewport.width, config.viewport.height);
        this.setNearClippingPlane(config.nearClippingPlane);
        this.setFarClippingPlane(config.farClippingPlane);
        this.projectionNeedsUpdate = false;
        this._resetGeometry();
    };
    CameraMarker.prototype.setOrthographicMode = function (isOrthographic) {
        this.isOrthographic = isOrthographic;
        this.projectionNeedsUpdate = true;
    };
    CameraMarker.prototype.setFOV = function (fov) {
        this.fov = fov;
        if (!this.isOrthographic)
            this.projectionNeedsUpdate = true;
    };
    CameraMarker.prototype.setOrthographicScale = function (orthographicScale) {
        this.orthographicScale = orthographicScale;
        if (this.isOrthographic)
            this.projectionNeedsUpdate = true;
    };
    CameraMarker.prototype.setViewport = function (x, y, width, height) {
        this.viewport.x = x;
        this.viewport.y = y;
        this.viewport.width = width;
        this.viewport.height = height;
        this.projectionNeedsUpdate = true;
    };
    CameraMarker.prototype.setNearClippingPlane = function (nearClippingPlane) {
        this.nearClippingPlane = nearClippingPlane;
        this.projectionNeedsUpdate = true;
    };
    CameraMarker.prototype.setFarClippingPlane = function (farClippingPlane) {
        this.farClippingPlane = farClippingPlane;
        this.projectionNeedsUpdate = true;
    };
    CameraMarker.prototype.setRatio = function (ratio) {
        this.ratio = ratio;
        this.projectionNeedsUpdate = true;
    };
    CameraMarker.prototype._resetGeometry = function () {
        var near = this.nearClippingPlane;
        var far = this.farClippingPlane;
        var farTopRight;
        var nearTopRight;
        if (this.isOrthographic) {
            var right = this.orthographicScale / 2 * this.viewport.width / this.viewport.height;
            if (this.ratio != null)
                right *= this.ratio;
            farTopRight = new THREE.Vector3(right, this.orthographicScale / 2, far);
            nearTopRight = new THREE.Vector3(right, this.orthographicScale / 2, near);
        }
        else {
            var tan = Math.tan(THREE.Math.degToRad(this.fov / 2));
            farTopRight = new THREE.Vector3(far * tan, far * tan, far);
            nearTopRight = farTopRight.clone().normalize().multiplyScalar(near);
        }
        var vertices = this.line.geometry.vertices;
        // Near plane
        vertices[0].set(-nearTopRight.x, nearTopRight.y, -near);
        vertices[1].set(nearTopRight.x, nearTopRight.y, -near);
        vertices[2].set(nearTopRight.x, nearTopRight.y, -near);
        vertices[3].set(nearTopRight.x, -nearTopRight.y, -near);
        vertices[4].set(nearTopRight.x, -nearTopRight.y, -near);
        vertices[5].set(-nearTopRight.x, -nearTopRight.y, -near);
        vertices[6].set(-nearTopRight.x, -nearTopRight.y, -near);
        vertices[7].set(-nearTopRight.x, nearTopRight.y, -near);
        // Far plane
        vertices[8].set(-farTopRight.x, farTopRight.y, -far);
        vertices[9].set(farTopRight.x, farTopRight.y, -far);
        vertices[10].set(farTopRight.x, farTopRight.y, -far);
        vertices[11].set(farTopRight.x, -farTopRight.y, -far);
        vertices[12].set(farTopRight.x, -farTopRight.y, -far);
        vertices[13].set(-farTopRight.x, -farTopRight.y, -far);
        vertices[14].set(-farTopRight.x, -farTopRight.y, -far);
        vertices[15].set(-farTopRight.x, farTopRight.y, -far);
        // Lines
        vertices[16].set(-nearTopRight.x, nearTopRight.y, -near);
        vertices[17].set(-farTopRight.x, farTopRight.y, -far);
        vertices[18].set(nearTopRight.x, nearTopRight.y, -near);
        vertices[19].set(farTopRight.x, farTopRight.y, -far);
        vertices[20].set(nearTopRight.x, -nearTopRight.y, -near);
        vertices[21].set(farTopRight.x, -farTopRight.y, -far);
        vertices[22].set(-nearTopRight.x, -nearTopRight.y, -near);
        vertices[23].set(-farTopRight.x, -farTopRight.y, -far);
        this.line.geometry.verticesNeedUpdate = true;
    };
    CameraMarker.prototype._destroy = function () {
        this.actor.threeObject.remove(this.line);
        this.line.geometry.dispose();
        this.line.material.dispose();
        this.line = null;
        _super.prototype._destroy.call(this);
    };
    CameraMarker.prototype.update = function () {
        if (this.projectionNeedsUpdate) {
            this.projectionNeedsUpdate = false;
            this._resetGeometry();
        }
    };
    /* tslint:disable:variable-name */
    CameraMarker.Updater = CameraUpdater_1.default;
    return CameraMarker;
}(SupEngine.ActorComponent));
exports.default = CameraMarker;

},{"./CameraUpdater":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CameraUpdater = /** @class */ (function () {
    function CameraUpdater(client, camera, config) {
        var _this = this;
        this.onResourceReceived = function (resourceId, resource) {
            _this.resource = resource;
            _this.updateRatio();
        };
        this.onResourceEdited = function (resourceId, command, propertyName) {
            _this.updateRatio();
        };
        this.client = client;
        this.camera = camera;
        this.config = config;
        this.camera.setConfig(this.config);
        this.camera.setRatio(5 / 3);
        this.client.subResource("gameSettings", this);
    }
    CameraUpdater.prototype.destroy = function () {
        if (this.resource != null)
            this.client.unsubResource("gameSettings", this);
    };
    CameraUpdater.prototype.config_setProperty = function (path, value) {
        this.camera.setConfig(this.config);
    };
    CameraUpdater.prototype.updateRatio = function () {
        if (this.resource.pub.ratioNumerator != null && this.resource.pub.ratioDenominator != null)
            this.camera.setRatio(this.resource.pub.ratioNumerator / this.resource.pub.ratioDenominator);
        else
            this.camera.setRatio(5 / 3);
    };
    return CameraUpdater;
}());
exports.default = CameraUpdater;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CameraMarker_1 = require("./CameraMarker");
SupEngine.registerEditorComponentClass("CameraMarker", CameraMarker_1.default);

},{"./CameraMarker":1}]},{},[3]);
