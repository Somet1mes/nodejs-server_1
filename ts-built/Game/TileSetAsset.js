"use strict";
/*

    Class to interact with the TileMap.ts class and deal with tileMap assets

    Code Other code to do with tilemaps and tileassets comes from the tileMap plugin
    -git hub source
        https://github.com/superpowers/superpowers-game/blob/be6d34744f8ab449ee63024698e670d67d6b26d6/plugins/default/tileMap

*/
Object.defineProperty(exports, "__esModule", { value: true });
var TileSetAsset = /** @class */ (function () {
    function TileSetAsset(inTSA) {
        this.tsa = inTSA;
    }
    TileSetAsset.prototype.getTileProperties = function (tile) {
        //let tilesPerRow = tmp.texture.image.width / tmp.grid.width;
        var tilesPerRow = 20;
        var x = tile % tilesPerRow;
        var y = Math.floor(tile / tilesPerRow);
        var properties = this.tsa.tileProperties[x + "_" + y];
        properties = (properties) ? properties : {};
        return properties;
    };
    return TileSetAsset;
}());
exports.default = TileSetAsset;
