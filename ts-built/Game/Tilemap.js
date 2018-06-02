"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = __importDefault(require("./Vector"));
var TileMapAsset_1 = __importDefault(require("./TileMapAsset"));
var TileSetAsset_1 = __importDefault(require("./TileSetAsset"));
var Tilemap = /** @class */ (function () {
    function Tilemap(inTMP, inTSA) {
        this.epsilon = 0.0001;
        this.tileMapAsset = new TileMapAsset_1.default(inTMP);
        this.tileSetAsset = new TileSetAsset_1.default(inTSA);
        // Copied from Arcade2DPhysics (see Hitbox.ts)
        this.mapToSceneFactor = {
            x: this.tileSetAsset.tsa.grid.width / this.tileMapAsset.tmp.pixelsPerUnit,
            y: this.tileSetAsset.tsa.grid.height / this.tileMapAsset.tmp.pixelsPerUnit,
        };
        this.layersIndex = [];
        for (var i = 0; i < this.tileMapAsset.tmp.layers.length; i++) {
            this.layersIndex[i] = i;
        }
        this.position = new Vector_1.default();
        this.position.x = 0;
        this.position.y = 0;
    }
    Tilemap.prototype.collides = function (body1, body2) {
        if (body2 === void 0) { body2 = this; }
        // These will all get recalculated
        body1.touches.top = false;
        body1.touches.bottom = false;
        body1.touches.right = false;
        body1.touches.left = false;
        this.checkTileMap(body1, body2, true);
    };
    // Body2 should be the tilemap, body1 should be a hitbox
    Tilemap.prototype.checkTileMap = function (body1, body2, moveBody) {
        function checkX(epsilon) {
            // Checks whcih side of the box to colide with
            var x = (body1.deltaX() < 0) ?
                Math.floor((body1.position.x - body2.position.x - body1.width / 2) / body2.mapToSceneFactor.x) :
                Math.floor((body1.position.x - body2.position.x + body1.width / 2 - epsilon) / body2.mapToSceneFactor.x);
            var y = body1.position.y - body2.position.y - body1.height / 2 + epsilon;
            var testedHeight = body1.height - 3 * epsilon;
            var totalPoints = Math.ceil(testedHeight / body2.mapToSceneFactor.y);
            for (var point = 0; point <= totalPoints; point++) {
                for (var _i = 0, _a = body2.layersIndex; _i < _a.length; _i++) {
                    var layer = _a[_i];
                    var tile = body2.tileMapAsset.getTileAt(layer, x, Math.floor((y + point * testedHeight / totalPoints) / body2.mapToSceneFactor.y));
                    //console.log(tile);
                    var collide = false;
                    if (body2.tileSetPropertyName != null)
                        collide = body2.tileSetAsset.getTileProperties(tile)[body2.tileSetPropertyName] != null;
                    //else if (tile !== -1) collide = true;
                    if (tile !== 0)
                        collide = true;
                    if (!collide)
                        continue;
                    if (moveBody) {
                        body1.velocity.x = -body1.velocity.x * body1.bounce.x;
                        if (body1.deltaX() < 0) {
                            body1.position.x = (x + 1) * body2.mapToSceneFactor.x + body2.position.x + body1.width / 2;
                            body1.touches.left = true;
                        }
                        else {
                            body1.position.x = (x) * body2.mapToSceneFactor.x + body2.position.x - body1.width / 2;
                            body1.touches.right = true;
                        }
                    }
                    return true;
                }
            }
            return false;
        }
        function checkY(epsilon) {
            var x = body1.position.x - body2.position.x - body1.width / 2 + epsilon;
            var y = (body1.deltaY() < 0) ?
                Math.floor((body1.position.y - body2.position.y - body1.height / 2) / body2.mapToSceneFactor.y) :
                Math.floor((body1.position.y - body2.position.y + body1.height / 2 - epsilon) / body2.mapToSceneFactor.y);
            var testedWidth = body1.width - 3 * epsilon;
            var totalPoints = Math.ceil(testedWidth / body2.mapToSceneFactor.x);
            for (var point = 0; point <= totalPoints; point++) {
                for (var _i = 0, _a = body2.layersIndex; _i < _a.length; _i++) {
                    var layer = _a[_i];
                    var tile = body2.tileMapAsset.getTileAt(layer, Math.floor((x + point * testedWidth / totalPoints) / body2.mapToSceneFactor.x), y);
                    //console.log(tile);
                    var collide = false;
                    if (body2.tileSetPropertyName != null)
                        collide = body2.tileSetAsset.getTileProperties(tile)[body2.tileSetPropertyName] != null;
                    //else if (tile !== -1) collide = true;
                    if (tile !== 0)
                        collide = true;
                    if (!collide)
                        continue;
                    if (moveBody) {
                        body1.velocity.y = -body1.velocity.y * body1.bounce.y;
                        if (body1.deltaY() < 0) {
                            body1.position.y = (y + 1) * body2.mapToSceneFactor.y + body2.position.y + body1.height / 2;
                            body1.touches.bottom = true;
                        }
                        else {
                            body1.position.y = (y) * body2.mapToSceneFactor.y + body2.position.y - body1.height / 2;
                            body1.touches.top = true;
                        }
                    }
                    return true;
                }
            }
            return false;
        }
        var x = body1.position.x;
        body1.position.x = body1.previousPosition.x;
        var gotCollision = false;
        if (checkY(this.epsilon))
            gotCollision = true;
        body1.position.x = x;
        if (checkX(this.epsilon))
            gotCollision = true;
        return gotCollision;
    };
    return Tilemap;
}());
exports.default = Tilemap;
