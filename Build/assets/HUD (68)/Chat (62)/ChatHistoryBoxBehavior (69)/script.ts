class ChatHistoryBoxBehavior extends Sup.Behavior {
    
    text = "TEXXXXXXXXXXXXXXXXXXXXXXT";
    numLines: number;
    textSize: number;
    private lineArray: Sup.Actor[];
    color: Sup.Color;
    maxLineLength: number;
    verticalSpace: number = 0.5; // A fraction of the line heigh to be added between lines ( <-- doesnt seem to be right, 0.5 works though)
    bg;
    
    awake() {
        
        this.numLines = 20;
        this.maxLineLength = 50;
        this.textSize = 64;
        this.color = new Sup.Color(0, 0, 0);
        //this.verticalSpace = 1;
        //this.color.setRGB(0, 0, 0);
        
        let scaleY = this.actor.getLocalScaleY();
        let scaleX = this.actor.getLocalScaleX();
        /*
        let bgsizeX = 50 * scaleX; // the number of characters per line
        let bgsizeY = this.numLines - 1;
        this.bg = Sup.appendScene("HUD/Chat/backgroundPrefab")[0];
        this.bg.setParent(this.actor);
        this.bg.setLocalX((bgsizeX / scaleX)/2);
        this.bg.setLocalY((bgsizeY / scaleY)/2);
        this.bg.setLocalZ(0);
        this.bg.setLocalScaleX(bgsizeX / scaleX);
        this.bg.setLocalScaleY(bgsizeY / scaleY);
        */
        
        
        this.lineArray = [];
        for (let i = 0; i < this.numLines; i++)
            {
                this.lineArray[i] = Sup.appendScene("HUD/Chat/textPrefab")[0];
                
                this.lineArray[i].setParent(this.actor);
                this.lineArray[i].setLocalX(0);
                this.lineArray[i].setLocalY((i / scaleY) + i * this.verticalSpace); // Remove the scaling applied by this.actor and add a bit of space between lines
                this.lineArray[i].setLocalZ(0);
                this.lineArray[i].setLocalScaleX(1);
                this.lineArray[i].setLocalScaleY(1);
                
                this.lineArray[i].textRenderer.setSize(this.textSize);
                this.lineArray[i].textRenderer.setColor(this.color);
                this.lineArray[i].textRenderer.setText(i);
                // I'll do the stuff bellow inside the prefab
                //this.lineArray[i].textRenderer.setAlignment("Left");
                //this.lineArray[i].textRenderer.setVerticalAlignment("Bottom");
            }
        
        this.listen();
    }

    update() {
        
    }
    
    listen()
    {
        // server to client chat message
        Globals.clientSocket.addEventListener('s_t_c_chat_msg', 
                                              function(msg)
                                              {
            this.addLine(msg);
        });
    }
    
    addLine(name:string, line:string)
    {
        if (line != "")
            {
                if (line.length > this.maxLineLength)
                    {
                        line = line.substring(0, this.maxLineLength);
                    }
                // Shift each line's text upward to the next line, then add the new text at the bottom
                for (let i = this.numLines - 1; i > 0; i--) // important that i iterates downwards. Also end at 1 so the new text can take the 0 spot
                    {
                        this.lineArray[i].textRenderer.setText(this.lineArray[i-1].textRenderer.getText());
                    }
                this.lineArray[0].textRenderer.setText(name + ": " + line);
            }

    }
}
Sup.registerBehavior(ChatHistoryBoxBehavior);
