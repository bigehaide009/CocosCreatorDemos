import CommonUIUtils from "./CommonUIUtils";
import { fileNames, prefix, servers } from "./Config";
import Main from "./Main";

export default class HotUpdate {

    private _isAndroid: boolean = false;
    private _writablePath: string = "";
    private _assetsManager: jsb.AssetsManager = null;
    private _label: cc.Label = null;
    
    private static _instance: HotUpdate = null;

    public static get instance() {
        if (!HotUpdate._instance) {
            HotUpdate._instance = new HotUpdate();
        }

        return HotUpdate._instance;
    }
    
    private constructor() {
        this._isAndroid = cc.sys.os == cc.sys.OS_ANDROID;

        if (this._isAndroid) {
            this._writablePath = jsb.fileUtils.getWritablePath();
        }
    }

    tryHotUpdate() {
        if (!this._isAndroid) {
            CommonUIUtils.instance.showFade("非安卓端无需热更。");
            return;
        }

        let storagePath: string = this._writablePath + prefix.hotUpdateAssets;
        this._assetsManager = new jsb.AssetsManager("", storagePath, this.compareFunction);
        this.initAssetsManager();
        console.log("State1: " + this._assetsManager.getState());
        this.checkUpdate();
        console.log("State2: " + this._assetsManager.getState());
    }

    private initAssetsManager() {
        let mainScript: Main = cc.find("Canvas").getComponent("Main");
        let manifest: cc.Asset = mainScript.manifest;
        this._label = mainScript.label;
        this._assetsManager.loadLocalManifest(manifest.nativeUrl);

        this._label.string = "正在检查本地热更新配置...";
        if (this._assetsManager.getState() == jsb.AssetsManager.State.UNINITED || 
        !this._assetsManager.getLocalManifest().isLoaded()) {
            CommonUIUtils.instance.showFade("Error: 本地缺失project.manifest文件");
            this._label.string = "热更失败。";
        }
    }

    private checkUpdate() {
        if (this._assetsManager.getState() != jsb.AssetsManager.State.UNCHECKED) {
            CommonUIUtils.instance.showFade("Error：无法检查更新");
            this._label.string = "热更失败。";
            return;
        }

        this._assetsManager.setEventCallback(this.checkFunctioin.bind(this));
        this._assetsManager.checkUpdate();
    }

    private compareFunction(versionA: string, versionB: string) {
        console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || '0');
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }

    private checkFunctioin(event: jsb.EventAssetsManager) {
        console.log("checkEvent:" + event.getEventCode());
        console.log("State: " + this._assetsManager.getState());

        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                CommonUIUtils.instance.showFade("Error: 缺失project.manifest文件");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                CommonUIUtils.instance.showFade("Error: 下载project.manifest文件失败");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                CommonUIUtils.instance.showFade("已经是最新版本无需更新");
                this._label.string = "已经是最新版本无需更新";
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                CommonUIUtils.instance.showFade("需进行更新，更新文件大小：" + Math.ceil(this._assetsManager.getTotalBytes() / 1024) + "kb");
                this._label.string = "检测到新的文件，即将开始更新。";
                break;
            default:
                return;
        }

        this._assetsManager.setEventCallback(null);
        if (this._assetsManager.getState() == jsb.AssetsManager.State.READY_TO_UPDATE) {
            this._label.string = "正在更新...";
            this._assetsManager.setEventCallback(this.updateFunction.bind(this));
            this._assetsManager.update();
        }

    }

    private updateFunction(event: jsb.EventAssetsManager) {
        console.log("updateEvent:" + event.getEventCode());
        console.log("State: " + this._assetsManager.getState());

        let needRestart = false;
        let end = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let fileStr: string = "File: " + event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                let byteStr: string = "Byte: " + event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                console.log(fileStr + "  " + byteStr);
                this._label.string = fileStr + "  " + byteStr;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                CommonUIUtils.instance.showFade("Error: 下载project.manifest文件失败");
                this._label.string = "热更失败";
                end = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this._label.string = "已是最新版本";
                end = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this._label.string = "更新完成";
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this._label.string = "更新失败:" + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this._label.string = "更新出错：" + event.getAssetId() + ', ' + event.getMessage();
                break;
            default:
                break;
        }

        if (end) {
            this._assetsManager.setEventCallback(null);
        }

        if (needRestart) {
            this._assetsManager.setEventCallback(null);

            let searchPaths = jsb.fileUtils.getSearchPaths();
            let newPaths = this._assetsManager.getLocalManifest().getSearchPaths();
            console.log("searchPaths:" + JSON.stringify(searchPaths));
            console.log("newPaths:" + JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            // restart game.
            setTimeout(() => {
                cc.game.restart();
            }, 1000)
        }
    }
}
