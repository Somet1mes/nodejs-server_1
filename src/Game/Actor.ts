import Hitbox from "./Hitbox"

export default class Actor
{

    // Stats
    HP;
    mana;
    agility;
    defence;
    AP;
    AD;

    //Sprite + Animation
    animation;
    horzFlip;

    // Not actual stats
    velocityX;
    velocityY;
    x;
    y;
    direction;

    // Hit box
    hitbox;

    constructor(x?, y?)
    {
        

        // Stats
        this.HP = 0;
        this.mana = 0;
        this.agility = 0;
        this.defence = 0;
        this.AP = 0;
        this.AD = 0;



        //Sprite + Animation
        this.animation = "Idle"
        this.horzFlip = false;


        // Not actual stats
        this.velocityX = 0;
        this.velocityY = 0;
        this.x = x || 0;
        this.y = y || 0;
        this.direction = "left";


        // Hit box
        this.hitbox = new Hitbox(1,1,1,1);
        this.hitbox.position.x = this.x;
        this.hitbox.position.y = this.y;
    }

}