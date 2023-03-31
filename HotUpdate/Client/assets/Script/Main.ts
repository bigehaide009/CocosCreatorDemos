import HotUpdate from "./HotUpdate";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Label) label: cc.Label = null;

    @property(cc.Asset) manifest: cc.Asset = null;

    protected onLoad(): void {
        this.label.string = "Here is " + cc.sys.os + ".";
        HotUpdate.instance.tryHotUpdate();
    }

    onClickJump() {
        this.label.string = "没有新场景可跳跃，需进行热更新。";
        // cc.director.loadScene("hotUpdate");
    }
}
