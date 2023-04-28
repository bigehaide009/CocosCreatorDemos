import CustomSprite from "./CustomSprite";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property([cc.Texture2D]) atlas: cc.Texture2D[] = [];

    protected onLoad(): void {
        cc.macro.CLEANUP_IMAGE_CACHE = true;
        cc.dynamicAtlasManager.enabled = false;
    }
}
