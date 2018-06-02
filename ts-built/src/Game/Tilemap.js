"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tilemap = /** @class */ (function () {
    function Tilemap(inTMP, inTSA) {
        this.epsilon = 0.0001;
        this.tileMapAsset = inTMP;
        this.tileSetAsset = inTSA;
        // Copied from Arcade2DPhysics (see Hitbox.ts)
        this.mapToSceneFactor = {
            x: this.tileSetAsset.__inner.data.grid.width / this.tileMapAsset.__inner.data.pixelsPerUnit,
            y: this.tileSetAsset.__inner.data.grid.height / this.tileMapAsset.__inner.data.pixelsPerUnit,
        };
    }
    Tilemap.prototype.checkCollision = function (inHitbox) {
    };
    // Body2 should be the tilemap, body1 should be a hitbox
    Tilemap.prototype.checkTileMap = function (body1, body2, moveBody) {
        function checkX() {
            var x = (body1.deltaX() < 0) ?
                Math.floor((body1.position.x - body2.position.x - body1.width / 2) / body2.mapToSceneFactor.x) :
                Math.floor((body1.position.x - body2.position.x + body1.width / 2 - this.epsilon) / body2.mapToSceneFactor.x);
            var y = body1.position.y - body2.position.y - body1.height / 2 + this.epsilon;
            var testedHeight = body1.height - 3 * this.epsilon;
            var totalPoints = Math.ceil(testedHeight / body2.mapToSceneFactor.y);
            for (var point = 0; point <= totalPoints; point++) {
                for (var _i = 0, _a = body2.layersIndex; _i < _a.length; _i++) {
                    var layer = _a[_i];
                    var tile = body2.tileMapAsset.getTileAt(layer, x, Math.floor((y + point * testedHeight / totalPoints) / body2.mapToSceneFactor.y));
                    var collide = false;
                    if (body2.tileSetPropertyName != null)
                        collide = body2.tileSetAsset.getTileProperties(tile)[body2.tileSetPropertyName] != null;
                    else if (tile !== -1)
                        collide = true;
                    if (!collide)
                        continue;
                    if (moveBody) {
                        body1.velocity.x = -body1.velocity.x * body1.bounceX;
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
        function checkY() {
            var x = body1.position.x - body2.position.x - body1.width / 2 + this.epsilon;
            var y = (body1.deltaY() < 0) ?
                Math.floor((body1.position.y - body2.position.y - body1.height / 2) / body2.mapToSceneFactor.y) :
                Math.floor((body1.position.y - body2.position.y + body1.height / 2 - this.epsilon) / body2.mapToSceneFactor.y);
            var testedWidth = body1.width - 3 * this.epsilon;
            var totalPoints = Math.ceil(testedWidth / body2.mapToSceneFactor.x);
            for (var point = 0; point <= totalPoints; point++) {
                for (var _i = 0, _a = body2.layersIndex; _i < _a.length; _i++) {
                    var layer = _a[_i];
                    var tile = body2.tileMapAsset.getTileAt(layer, Math.floor((x + point * testedWidth / totalPoints) / body2.mapToSceneFactor.x), y);
                    var collide = false;
                    if (body2.tileSetPropertyName != null)
                        collide = body2.tileSetAsset.getTileProperties(tile)[body2.tileSetPropertyName] != null;
                    else if (tile !== -1)
                        collide = true;
                    if (!collide)
                        continue;
                    if (moveBody) {
                        body1.velocity.y = -body1.velocity.y * body1.bounceY;
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
        if (checkY())
            gotCollision = true;
        body1.position.x = x;
        if (checkX())
            gotCollision = true;
        return gotCollision;
    };
    return Tilemap;
}());
exports.default = Tilemap;
