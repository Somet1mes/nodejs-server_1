/*

    Class to interact with the TileMap.ts class and deal with tileMap assets

    Code Other code to do with tilemaps and tileassets comes from the tileMap plugin
    -git hub source
        https://github.com/superpowers/superpowers-game/blob/be6d34744f8ab449ee63024698e670d67d6b26d6/plugins/default/tileMap

*/

export default class TileMapAsset
{

    public tmp; // tilemap json
    //public tsa;

    constructor(inTMP)
    {
        this.tmp = inTMP;
        //this.tsa = inTSA;

    }
/*
    getTileAt(layer, x, y) 
    {
      let tileSet = this.tsa
      let tilesPerRow = tileSet.__inner.data.texture.image.width / tileSet.__inner.data.grid.width;
      let tilesPerColumn = tileSet.__inner.data.texture.image.height / tileSet.__inner.data.grid.height;
      let transform = this.__inner.getTileAtPt2(layer, x, y);
      if (transform === 0) return -1;

      let tileX = transform[0]; let tileY = transform[1];
      if (tileX === -1 || tileY === -1 || tileY >= tilesPerColumn ||
      (tileX === tilesPerRow - 1 && tileY === tilesPerColumn - 1))
        return -1;

      return tileY * tilesPerRow + tileX;
    }
*/
    getTileAt(layer: number, x: number, y: number) {
      if (x < 0 || y < 0 || x >= this.tmp.width || y >= this.tmp.height) return 0;

      const index = y * this.tmp.width + x;
      //console.log(this.tmp.layers);
      //console.log(layer);
      return this.tmp.layers[layer].data[index];
    }

}