/*

    Define a class for 3D vectors

*/


export default class Vector
{

    public x: number;
    public y: number;
    public z: number;

    constructor(x?:number, y?:number, z?:number)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
}