import CustomAssembler from "./CustomAssembler";
import Main from "./Main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CustomSprite extends cc.Sprite {

    _resetAssembler() {
        this.setVertsDirty();
        let assembler = this._assembler = new CustomAssembler();
        assembler.init(this);
        // this.spriteFrame = cc.find("Canvas").getComponent(Main).spf;
        assembler.updateTextureIdx(this.getTextureIdx());

        //@ts-ignore
        this._updateColor();        // may be no need
    }

    getTextureIdx() {
        let texture = this.spriteFrame.getTexture();
        let textures = cc.find("Canvas").getComponent(Main).atlas;
        //@ts-ignore
        this.getMaterial(0).updateHash(99999);
        let textureidx = textures.indexOf(texture);
        return textureidx;
    }
}
