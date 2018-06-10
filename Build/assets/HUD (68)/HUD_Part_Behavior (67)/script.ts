class HUD_Part_Behavior extends Sup.Behavior {
    

    protected viewWidth: number;
    protected viewHeight: number;
    protected playerscaleX: number;
    protected playerscaleY: number
    public offset: THREE.Vector3;
    public partName: string;
    public clickable: boolean;
    public hasBox: boolean;
    public boxLocalPos: THREE.Vector3;
    public boxLengths: THREE.Vector3;
    public boxSprite: Sup.Actor;
    
    awake() {
        
        this.partName = "Default";
        this.clickable = false;
        this.hasBox = false;
        this.boxLocalPos = new THREE.Vector3();
        this.boxLengths = new THREE.Vector3();
        
        // So the FOV is 45 degrees, at a distance of 20 (the global z of the camera) (for the player's camera (this will probably be the only camera?))
        // This will give a visable screen width of: (in global units) ( at the zPlane)
        this.playerscaleX = this.actor.getParent().getParent().getLocalScaleX();
        this.playerscaleY = this.actor.getParent().getParent().getLocalScaleY();
        let zPlane = (this.actor.getParent().getPosition().z - this.actor.getPosition().z); // The thing we're viewing has to be infront of the camera, otherwise this will be negative
        if (zPlane < 0) console.log("ERROR: Hud Item Behind camera");
        this.viewHeight = (zPlane * Math.tan(Sup.Math.toRadians(this.actor.getParent().camera.getFOV()/2)))*2;
        this.viewWidth = (this.viewHeight/Sup.Game.getScreenRatio().height) * Sup.Game.getScreenRatio().width;
        
        
        // If we want HUD elements to have layers, we need to be able to give them z-positions other than 0
        // To do this we will scale x and y based on the z so that they still fit in the camera
        // Doing some geometry (diagram recommended) you can find:      (even with a diagram this can get confusing)
        let y = this.viewHeight;
        let z = this.actor.getPosition().z;
        let FOV = Sup.Math.toRadians(this.actor.getParent().camera.getFOV()/2);
        let yscale = (y - (z * Math.tan(FOV))) / y;
        //let xscale = (yscale/Sup.Game.getScreenRatio().height) * Sup.Game.getScreenRatio().width;
        this.actor.setLocalScaleY(yscale * this.actor.getLocalScaleY());
        this.actor.setLocalScaleX(yscale * this.actor.getLocalScaleX());
        
        // convert from global units to local units.
        this.viewHeight = this.viewHeight / this.playerscaleY;
        this.viewWidth = this.viewWidth / this.playerscaleX;
        // offset if needed (in global units, because of the player scale conversion)
        this.offset = new THREE.Vector3();
        this.offset.x = 0 / this.playerscaleX;
        this.offset.y = 0 / this.playerscaleY;
        
        this.changePos();
        
    }

    update() 
    {
        if (this.clickable === true && this.hasBox === true)
            {
                this.checkClicked();                
            }
    }
    
    checkClicked()
    {
        if (Sup.Input.wasMouseButtonJustReleased(0))
            {
                // if inFocus is something else we let that stay how it is unless this element was clicked
                // if inFocus is this and the mouse was clicked, but nothing else checked so far is in focus (otherwise inFocus != partName)
                //      then set the focus to game, if this was clicked again then it goes back into focus, if somethign else gets checked as true that becomes
                //      the focus, if the click doesn't land on anything "Game" becomes the focus
                if (HUD.inFocus === this.partName)
                    {
                        HUD.inFocus = "Game";
                    }
                let mp = Sup.Input.getMousePosition()
                /* Ok a bit of a note about how the mouse positions seem to work here:
                    A mp of 0,0 at the centre of the screen increaseing to 1,1 at the top right and -1,-1 at the bottom left,
                    Fortunately our camera is allways pointing at the middle of the screen.
                    And since all HUD parts are children of the camera we simply need to use their local positions and the
                    previously calculated screen dimensions
                */
                let lp = this.actor.getLocalPosition()
                let startX = (lp.x + this.boxLocalPos.x) / (this.viewWidth/2);
                let endX = (lp.x + this.boxLocalPos.x + this.boxLengths.x/2) / (this.viewWidth/2); // I don't know why i need the factor of 2 for boxlength/2, I might need it for boxPos as well since all testing was doen with boxPos = 0
                if (mp.x > startX && mp.x < endX )
                    {
                        let startY = (lp.y + this.boxLocalPos.y) / (this.viewHeight/2);
                        let endY = (lp.y + this.boxLocalPos.y + this.boxLengths.y/2) / (this.viewHeight/2);
                        if (mp.y > startY && mp.y < endY )
                            {
                                HUD.inFocus = this.partName;
                            }
                    }
                /*
                console.log(HUD.inFocus);
                console.log(mp);
                console.log(startX, endX);
                console.log((this.boxLengths.x) / (this.viewWidth/2)) */
            }
    }
    
    changePos()
    {
        // set position at the bottom left
        this.actor.setLocalPosition((-this.viewWidth/2.0 + this.offset.x), (-this.viewHeight/2.0 + this.offset.y));
    }
    
    /*
    //scale the position based on the screen scaling
    scalePos()
    {
        let xscale = SupWebGLRenderer.getSize().width/2.0;
        let yscale = SupWebGLRenderer.getSize().height/2.0;
        //this.actor.setLocalPosition(this.initPosX + xscale, this.initPosY + yscale);
        //this.actor.setLocalPosition(this.actor.getParent().getChild('camera').camera.getViewport().x, this.actor.getParent().camera.getViewport().y);
    }*/
    
    setupBox(xpos:number, ypos:number, xlength:number, ylength:number)
    {
        this.boxLengths.x = xlength / this.playerscaleX;
        this.boxLengths.y = ylength / this.playerscaleY;
        this.boxLocalPos.x = xpos  / this.playerscaleY;
        this.boxLocalPos.y = ypos  / this.playerscaleY;
    }
    
    scaleSquareSprite(sprite: Sup.Actor)
    {
        sprite.setLocalScaleX(this.boxLengths.x);// / this.playerscaleX);
        sprite.setLocalScaleY(this.boxLengths.y);// / this.playerscaleY);
        sprite.setLocalX(this.boxLocalPos.x);
        sprite.setLocalY(this.boxLocalPos.y);
        sprite.setLocalZ(this.boxLocalPos.z);
    }
}
Sup.registerBehavior(HUD_Part_Behavior);
