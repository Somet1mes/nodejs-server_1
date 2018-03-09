var playerID;

class TextFieldBehavior extends Sup.Behavior {
  
  text = "HELP";

  private font: Sup.Font;
  private column = 0;
  private cursorActor: Sup.Actor;
  private cursorWidth: number;
  private blinkTimer = 0;
  static blinkDuration = 20;
  //serverURL = "http://192.168.1.3:8080;"
  serverURL = "http://trying-again-trying-again.193b.starter-ca-central-1.openshiftapps.com/";
  socket;
  
  awake() {
    this.font = this.actor.textRenderer.getFont();
    
    this.actor.textRenderer.setText(this.text);
    this.column = this.text.length;
    this.cursorActor = this.actor.getChild("cursor");
    this.cursorActor.textRenderer.setOpacity(0.5);
    this.cursorWidth = this.font.getTextWidth("|");
    
    this.socket = io(this.serverURL);
  }

  update() {
    // Typing
    let textEntered = Sup.Input.getTextEntered();
    if (textEntered.length > 0) {
      for (let character of textEntered) {
        this.text = this.text.substring(0, this.column) + character + this.text.substring(this.column);
        this.column++;
      }
      this.refresh();
    }
    
    // Erasing
    if (Sup.Input.wasKeyJustPressed("BACK_SPACE", { autoRepeat: true })) {
      this.text = this.text.substring(0, this.column - 1) + this.text.substring(this.column);
      this.column = Math.max(0, this.column - 1);
      this.refresh();
    }

    if (Sup.Input.wasKeyJustPressed("DELETE", { autoRepeat: true })) {
      this.text = this.text.substring(0, this.column) + this.text.substring(this.column + 1);
      this.refresh();
    }
    
    if (Sup.Input.wasKeyJustPressed("ENTER"))
      {
        this.checkID(this.text);
      }
    
    // Moving around
    if (Sup.Input.wasKeyJustPressed("LEFT", { autoRepeat: true })) { this.column = Math.max(0, this.column - 1); this.refresh(); }
    if (Sup.Input.wasKeyJustPressed("RIGHT", { autoRepeat: true })) { this.column = Math.min(this.text.length, this.column + 1); this.refresh(); }
    if (Sup.Input.wasKeyJustPressed("HOME", { autoRepeat: true })) { this.column = 0; this.refresh(); }
    if (Sup.Input.wasKeyJustPressed("END", { autoRepeat: true })) { this.column = this.text.length; this.refresh(); }
    
    // Make cursor blink
    this.blinkTimer++;
    if (this.blinkTimer === TextFieldBehavior.blinkDuration) {
      this.blinkTimer = 0;
      this.cursorActor.setVisible(!this.cursorActor.getVisible());
    }
  }

  refresh() {
    this.blinkTimer = 0;
    this.cursorActor.setVisible(true);

    this.actor.textRenderer.setText(this.text);
    let offset = this.font.getTextWidth(this.text.substring(0, this.column));
    if (this.actor.textRenderer.getAlignment() === "center") offset -= this.font.getTextWidth(this.text) / 2;
    this.cursorActor.setLocalX(offset - this.cursorWidth / 2);
  }
  
  checkID(id)
  {
    this.socket.emit('checkID', id);
    
    this.socket.on('returnID', function(idcheck)
                  {
      if (idcheck === true)
        {
          Sup.loadScene("Scene");
          playerID = id;
        }
      else
        {
          this.text = "Enter a Unique ID";
          this.refresh();
        }
    })
    
  }
  

}
Sup.registerBehavior(TextFieldBehavior);
