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
var Behavior = /** @class */ (function (_super) {
    __extends(Behavior, _super);
    function Behavior(actor, funcs) {
        var _this = _super.call(this, actor, "Behavior") || this;
        _this.funcs = funcs;
        return _this;
    }
    Behavior.prototype.awake = function () { if (this.funcs.awake != null)
        this.funcs.awake(); };
    Behavior.prototype.start = function () { if (this.funcs.start != null)
        this.funcs.start(); };
    Behavior.prototype.update = function () { if (this.funcs.update != null)
        this.funcs.update(); };
    Behavior.prototype._destroy = function () {
        if (this.funcs.onDestroy != null)
            this.funcs.onDestroy();
        this.funcs = null;
        _super.prototype._destroy.call(this);
    };
    Behavior.prototype.setIsLayerActive = function (active) { };
    return Behavior;
}(SupEngine.ActorComponent));
exports.default = Behavior;

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
var BehaviorUpdater_1 = require("./BehaviorUpdater");
var BehaviorMarker = /** @class */ (function (_super) {
    __extends(BehaviorMarker, _super);
    /* tslint:enable:variable-name */
    function BehaviorMarker(actor) {
        return _super.call(this, actor, "BehaviorMarker") || this;
    }
    BehaviorMarker.prototype.setIsLayerActive = function (active) { };
    /* tslint:disable:variable-name */
    BehaviorMarker.Updater = BehaviorUpdater_1.default;
    return BehaviorMarker;
}(SupEngine.ActorComponent));
exports.default = BehaviorMarker;

},{"./BehaviorUpdater":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorUpdater = /** @class */ (function () {
    function BehaviorUpdater(client, behavior, config) {
    }
    BehaviorUpdater.prototype.destroy = function () { };
    return BehaviorUpdater;
}());
exports.default = BehaviorUpdater;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Behavior_1 = require("./Behavior");
var BehaviorMarker_1 = require("./BehaviorMarker");
SupEngine.registerComponentClass("Behavior", Behavior_1.default);
SupEngine.registerEditorComponentClass("BehaviorMarker", BehaviorMarker_1.default);

},{"./Behavior":1,"./BehaviorMarker":2}]},{},[4]);
