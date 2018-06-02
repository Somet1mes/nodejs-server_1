export default class Key
{

    public active;
    public wasJustPressed;
    public wasJustReleased;
    public prev;
    
    constructor()
    {
        this.active = false;
        this.wasJustPressed = false;
        this.wasJustReleased = false;
        this.prev = false; //false = up true = down
    }
}