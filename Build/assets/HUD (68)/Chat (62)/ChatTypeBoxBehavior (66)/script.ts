class ChatTypeBoxBehavior extends Sup.Behavior {
  
  text:string = "Chat Here";

  private font: Sup.Font;
  private column = 0;
  private cursorActor: Sup.Actor;
  private cursorWidth: number;
  private blinkTimer = 0;
  static blinkDuration = 20;
    private chatHistBox: ChatHistoryBoxBehavior;
    private fontSize = 64;
  
  
  awake() {
    this.font = this.actor.textRenderer.getFont();
    
    this.actor.textRenderer.setText(this.text);
    this.column = this.text.length;
    this.cursorActor = this.actor.getChild("cursor");
    this.cursorActor.textRenderer.setOpacity(0.5);
      
    this.cursorWidth = this.font.getTextWidth("|") * (this.actor.textRenderer.getSize() / this.fontSize);
      
      this.chatHistBox = this.actor.getParent().getChild("Chat_history_box").getBehavior(ChatHistoryBoxBehavior);
    
  }

  update() {
      
      
      // Check that this HUD element is in focus
      if (HUD.inFocus === "Chat")
          {

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

            if (Sup.Input.wasKeyJustPressed("RETURN"))
              {
                  Globals.clientSocket.emit('c_t_s_chat_msg', this.text) //client to server chat message
                  this.chatHistBox.addLine(Globals.getPlayerName(), this.text);
                  this.text = "";
                  this.column = this.text.length;
                  this.refresh();
              }

            // Moving around
            if (Sup.Input.wasKeyJustPressed("LEFT", { autoRepeat: true })) { this.column = Math.max(0, this.column - 1); this.refresh(); }
            if (Sup.Input.wasKeyJustPressed("RIGHT", { autoRepeat: true })) { this.column = Math.min(this.text.length, this.column + 1); this.refresh(); }
            if (Sup.Input.wasKeyJustPressed("HOME", { autoRepeat: true })) { this.column = 0; this.refresh(); }
            if (Sup.Input.wasKeyJustPressed("END", { autoRepeat: true })) { this.column = this.text.length; this.refresh(); }

            // Make cursor blink
            this.blinkTimer++;
            if (this.blinkTimer === ChatTypeBoxBehavior.blinkDuration) {
              this.blinkTimer = 0;
              this.cursorActor.setVisible(!this.cursorActor.getVisible());
            }
        }
             
  }
  

  refresh() {
    this.blinkTimer = 0;
    this.cursorActor.setVisible(true);

    this.actor.textRenderer.setText(this.text);
    let offset = this.font.getTextWidth(this.text.substring(0, this.column)) * (this.actor.textRenderer.getSize() / this.fontSize);
    if (this.actor.textRenderer.getAlignment() === "center") offset -= this.font.getTextWidth(this.text) / 2;
    this.cursorActor.setLocalX(offset - this.cursorWidth / 2);
  }
  
}
Sup.registerBehavior(ChatTypeBoxBehavior);
