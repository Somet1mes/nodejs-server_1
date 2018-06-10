class HUD_Chat_Behavior extends HUD_Part_Behavior {
    awake() {
        super.awake();
        this.partName = "Chat";
        this.offset.x = 0;
        this.offset.y = 0;
        this.changePos();
        
        // add a clickable box and background
        // box measured from bottom left of box
        this.clickable = true;
        this.hasBox = true;
        this.setupBox(0,0,9,6);
        // add a background sprite
        this.boxSprite = Sup.appendScene("HUD/Chat/backgroundPrefab")[0];
        this.boxSprite.setParent(this.actor);
        this.scaleSquareSprite(this.boxSprite);
    }

    update() {
        super.update();
    }
}
Sup.registerBehavior(HUD_Chat_Behavior);
