"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var playerID;
var TextFieldBehavior = /** @class */ (function (_super) {
    __extends(TextFieldBehavior, _super);
    function TextFieldBehavior() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "HELP";
        _this.column = 0;
        _this.blinkTimer = 0;
        _this.serverURL = "http://127.0.0.1:8080";
        return _this;
    }
    TextFieldBehavior.prototype.awake = function () {
        this.font = this.actor.textRenderer.getFont();
        this.actor.textRenderer.setText(this.text);
        this.column = this.text.length;
        this.cursorActor = this.actor.getChild("cursor");
        this.cursorActor.textRenderer.setOpacity(0.5);
        this.cursorWidth = this.font.getTextWidth("|");
        this.socket = io(this.serverURL);
        console.log("Connect Thingo");
        console.log(this.socket);
        this.socket.on('connect', function () { console.log("connected to server"); });
        this.socket.emit('poops', 1);
        this.socket.on('poops', function (a) { console.log(a); });
    };
    TextFieldBehavior.prototype.update = function () {
        // Typing
        var textEntered = Sup.Input.getTextEntered();
        if (textEntered.length > 0) {
            for (var _i = 0, textEntered_1 = textEntered; _i < textEntered_1.length; _i++) {
                var character = textEntered_1[_i];
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
        if (Sup.Input.wasKeyJustPressed("RETURN")) {
            this.checkID(this.text);
        }
        // Moving around
        if (Sup.Input.wasKeyJustPressed("LEFT", { autoRepeat: true })) {
            this.column = Math.max(0, this.column - 1);
            this.refresh();
        }
        if (Sup.Input.wasKeyJustPressed("RIGHT", { autoRepeat: true })) {
            this.column = Math.min(this.text.length, this.column + 1);
            this.refresh();
        }
        if (Sup.Input.wasKeyJustPressed("HOME", { autoRepeat: true })) {
            this.column = 0;
            this.refresh();
        }
        if (Sup.Input.wasKeyJustPressed("END", { autoRepeat: true })) {
            this.column = this.text.length;
            this.refresh();
        }
        // Make cursor blink
        this.blinkTimer++;
        if (this.blinkTimer === TextFieldBehavior.blinkDuration) {
            this.blinkTimer = 0;
            this.cursorActor.setVisible(!this.cursorActor.getVisible());
        }
    };
    TextFieldBehavior.prototype.checkID = function (id) {
        var _self = this;
        this.socket.emit('checkID', Number(id));
        console.log(id);
        console.log(this.socket);
        this.socket.once('returnID', function (idcheck) {
            console.log(idcheck);
            if (idcheck === true) {
                playerID = Number(id);
                _self.socket.disconnect();
                Sup.loadScene("Scene");
            }
            else {
                _self.text = "Enter a Unique ID";
                _self.refresh();
            }
        });
    };
    TextFieldBehavior.prototype.refresh = function () {
        this.blinkTimer = 0;
        this.cursorActor.setVisible(true);
        this.actor.textRenderer.setText(this.text);
        var offset = this.font.getTextWidth(this.text.substring(0, this.column));
        if (this.actor.textRenderer.getAlignment() === "center")
            offset -= this.font.getTextWidth(this.text) / 2;
        this.cursorActor.setLocalX(offset - this.cursorWidth / 2);
    };
    TextFieldBehavior.blinkDuration = 20;
    return TextFieldBehavior;
}(Sup.Behavior));
Sup.registerBehavior(TextFieldBehavior);
