/*

    This class just stores some data for "actions" that a player may make

*/

export default class ActionClass
{
    public type: string;
    public time: any;
    public dir: string;

    constructor()
    {
        this.type = "none";
    }

}