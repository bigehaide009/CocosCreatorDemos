
export default class CommonUIUtils{
    private static _instance: CommonUIUtils = null;

    public static get instance() {
        if (!CommonUIUtils._instance) {
            CommonUIUtils._instance = new CommonUIUtils();
        }

        return CommonUIUtils._instance;
    }
    
    private constructor() {
        
    }

    showFade(str: string, delay: number = 0) {

        let fadeLabelNode = cc.find("Canvas/fadeLabel");

        let node = cc.instantiate(fadeLabelNode);
        node.parent = fadeLabelNode.parent;
        node.opacity = 0;
        node.getComponent(cc.Label).string = str;

        let action = cc.tween(node)
        .set({opacity: 255})
        .to(1, {position: cc.v3(0, 100, 0), opacity: 180})
        .set({opacity: 0})
        .call(() => {
            node.removeFromParent();
            node.destroy();
        });

        setTimeout(() => {
            action.start();
        }, delay * 1000);
    }
}
