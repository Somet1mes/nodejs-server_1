/*

    Class to interact with the TileMap.ts class and deal with tileMap assets

    Code Other code to do with tilemaps and tileassets comes from the tileMap plugin
    -git hub source
        https://github.com/superpowers/superpowers-game/blob/be6d34744f8ab449ee63024698e670d67d6b26d6/plugins/default/tileMap

*/

export default class TileSetAsset
{

    public tsa; // tilemap json

    constructor(inTSA)
    {
        this.tsa = inTSA;
    }

    getTileProperties(tile) 
    {
      //let tilesPerRow = tmp.texture.image.width / tmp.grid.width;
      let tilesPerRow = 20;

      let x = tile % tilesPerRow;
      let y = Math.floor(tile / tilesPerRow);
      let properties = this.tsa.tileProperties[x + "_" + y];
      properties = (properties) ? properties : {};
      return properties;
    }


}