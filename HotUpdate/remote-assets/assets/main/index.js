window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  CommonUIUtils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "149a8qy4OFI34QVvgwD0f/y", "CommonUIUtils");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CommonUIUtils = function() {
      function CommonUIUtils() {}
      Object.defineProperty(CommonUIUtils, "instance", {
        get: function() {
          CommonUIUtils._instance || (CommonUIUtils._instance = new CommonUIUtils());
          return CommonUIUtils._instance;
        },
        enumerable: false,
        configurable: true
      });
      CommonUIUtils.prototype.showFade = function(str, delay) {
        void 0 === delay && (delay = 0);
        var fadeLabelNode = cc.find("Canvas/fadeLabel");
        var node = cc.instantiate(fadeLabelNode);
        node.parent = fadeLabelNode.parent;
        node.opacity = 0;
        node.getComponent(cc.Label).string = str;
        var action = cc.tween(node).set({
          opacity: 255
        }).to(1, {
          position: cc.v3(0, 100, 0),
          opacity: 180
        }).set({
          opacity: 0
        }).call(function() {
          node.removeFromParent();
          node.destroy();
        });
        setTimeout(function() {
          action.start();
        }, 1e3 * delay);
      };
      CommonUIUtils._instance = null;
      return CommonUIUtils;
    }();
    exports.default = CommonUIUtils;
    cc._RF.pop();
  }, {} ],
  Config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c28f2CsybpKVZ7V2rWMhNy9", "Config");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.fileNames = exports.prefix = exports.servers = void 0;
    var servers = {
      hotUpdate: "http://192.168.2.4:1234"
    };
    exports.servers = servers;
    var prefix = {
      hotUpdate: "hotUpdate/",
      hotUpdateAssets: "hotUpdate/assets/"
    };
    exports.prefix = prefix;
    var fileNames = {
      manifest: "project.manifest"
    };
    exports.fileNames = fileNames;
    cc._RF.pop();
  }, {} ],
  HotUpdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6d27adqvIZHV6Kp/ao57yz/", "HotUpdate");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CommonUIUtils_1 = require("./CommonUIUtils");
    var Config_1 = require("./Config");
    var HotUpdate = function() {
      function HotUpdate() {
        this._isAndroid = false;
        this._writablePath = "";
        this._assetsManager = null;
        this._label = null;
        this._isAndroid = cc.sys.os == cc.sys.OS_ANDROID;
        this._isAndroid && (this._writablePath = jsb.fileUtils.getWritablePath());
      }
      Object.defineProperty(HotUpdate, "instance", {
        get: function() {
          HotUpdate._instance || (HotUpdate._instance = new HotUpdate());
          return HotUpdate._instance;
        },
        enumerable: false,
        configurable: true
      });
      HotUpdate.prototype.tryHotUpdate = function() {
        if (!this._isAndroid) {
          CommonUIUtils_1.default.instance.showFade("\u975e\u5b89\u5353\u7aef\u65e0\u9700\u70ed\u66f4\u3002");
          return;
        }
        var storagePath = this._writablePath + Config_1.prefix.hotUpdateAssets;
        this._assetsManager = new jsb.AssetsManager("", storagePath, this.compareFunction);
        this.initAssetsManager();
        console.log("State1: " + this._assetsManager.getState());
        this.checkUpdate();
        console.log("State2: " + this._assetsManager.getState());
      };
      HotUpdate.prototype.initAssetsManager = function() {
        var mainScript = cc.find("Canvas").getComponent("Main");
        var manifest = mainScript.manifest;
        this._label = mainScript.label;
        this._assetsManager.loadLocalManifest(manifest.nativeUrl);
        this._label.string = "\u6b63\u5728\u68c0\u67e5\u672c\u5730\u70ed\u66f4\u65b0\u914d\u7f6e...";
        if (this._assetsManager.getState() == jsb.AssetsManager.State.UNINITED || !this._assetsManager.getLocalManifest().isLoaded()) {
          CommonUIUtils_1.default.instance.showFade("Error: \u672c\u5730\u7f3a\u5931project.manifest\u6587\u4ef6");
          this._label.string = "\u70ed\u66f4\u5931\u8d25\u3002";
        }
      };
      HotUpdate.prototype.checkUpdate = function() {
        if (this._assetsManager.getState() != jsb.AssetsManager.State.UNCHECKED) {
          CommonUIUtils_1.default.instance.showFade("Error\uff1a\u65e0\u6cd5\u68c0\u67e5\u66f4\u65b0");
          this._label.string = "\u70ed\u66f4\u5931\u8d25\u3002";
          return;
        }
        this._assetsManager.setEventCallback(this.checkFunctioin.bind(this));
        this._assetsManager.checkUpdate();
      };
      HotUpdate.prototype.compareFunction = function(versionA, versionB) {
        console.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
        var vA = versionA.split(".");
        var vB = versionB.split(".");
        for (var i = 0; i < vA.length; ++i) {
          var a = parseInt(vA[i]);
          var b = parseInt(vB[i] || "0");
          if (a === b) continue;
          return a - b;
        }
        return vB.length > vA.length ? -1 : 0;
      };
      HotUpdate.prototype.checkFunctioin = function(event) {
        console.log("checkEvent:" + event.getEventCode());
        console.log("State: " + this._assetsManager.getState());
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          CommonUIUtils_1.default.instance.showFade("Error: \u7f3a\u5931project.manifest\u6587\u4ef6");
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          CommonUIUtils_1.default.instance.showFade("Error: \u4e0b\u8f7dproject.manifest\u6587\u4ef6\u5931\u8d25");
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          CommonUIUtils_1.default.instance.showFade("\u5df2\u7ecf\u662f\u6700\u65b0\u7248\u672c\u65e0\u9700\u66f4\u65b0");
          this._label.string = "\u5df2\u7ecf\u662f\u6700\u65b0\u7248\u672c\u65e0\u9700\u66f4\u65b0";
          break;

         case jsb.EventAssetsManager.NEW_VERSION_FOUND:
          CommonUIUtils_1.default.instance.showFade("\u9700\u8fdb\u884c\u66f4\u65b0\uff0c\u66f4\u65b0\u6587\u4ef6\u5927\u5c0f\uff1a" + Math.ceil(this._assetsManager.getTotalBytes() / 1024) + "kb");
          this._label.string = "\u68c0\u6d4b\u5230\u65b0\u7684\u6587\u4ef6\uff0c\u5373\u5c06\u5f00\u59cb\u66f4\u65b0\u3002";
          break;

         default:
          return;
        }
        this._assetsManager.setEventCallback(null);
        if (this._assetsManager.getState() == jsb.AssetsManager.State.READY_TO_UPDATE) {
          this._label.string = "\u6b63\u5728\u66f4\u65b0...";
          this._assetsManager.setEventCallback(this.updateFunction.bind(this));
          this._assetsManager.update();
        }
      };
      HotUpdate.prototype.updateFunction = function(event) {
        console.log("updateEvent:" + event.getEventCode());
        console.log("State: " + this._assetsManager.getState());
        var needRestart = false;
        var end = false;
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.UPDATE_PROGRESSION:
          var fileStr = "File: " + event.getDownloadedFiles() + " / " + event.getTotalFiles();
          var byteStr = "Byte: " + event.getDownloadedBytes() + " / " + event.getTotalBytes();
          console.log(fileStr + "  " + byteStr);
          this._label.string = fileStr + "  " + byteStr;
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          CommonUIUtils_1.default.instance.showFade("Error: \u4e0b\u8f7dproject.manifest\u6587\u4ef6\u5931\u8d25");
          this._label.string = "\u70ed\u66f4\u5931\u8d25";
          end = true;
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          this._label.string = "\u5df2\u662f\u6700\u65b0\u7248\u672c";
          end = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FINISHED:
          this._label.string = "\u66f4\u65b0\u5b8c\u6210";
          needRestart = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FAILED:
          this._label.string = "\u66f4\u65b0\u5931\u8d25:" + event.getMessage();
          break;

         case jsb.EventAssetsManager.ERROR_UPDATING:
          this._label.string = "\u66f4\u65b0\u51fa\u9519\uff1a" + event.getAssetId() + ", " + event.getMessage();
        }
        end && this._assetsManager.setEventCallback(null);
        if (needRestart) {
          this._assetsManager.setEventCallback(null);
          var searchPaths = jsb.fileUtils.getSearchPaths();
          var newPaths = this._assetsManager.getLocalManifest().getSearchPaths();
          console.log("searchPaths:" + JSON.stringify(searchPaths));
          console.log("newPaths:" + JSON.stringify(newPaths));
          Array.prototype.unshift.apply(searchPaths, newPaths);
          localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
          jsb.fileUtils.setSearchPaths(searchPaths);
          setTimeout(function() {
            cc.game.restart();
          }, 1e3);
        }
      };
      HotUpdate._instance = null;
      return HotUpdate;
    }();
    exports.default = HotUpdate;
    cc._RF.pop();
  }, {
    "./CommonUIUtils": "CommonUIUtils",
    "./Config": "Config"
  } ],
  Main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "483c90T3RFGKai8IX/S1HC7", "Main");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HotUpdate_1 = require("./HotUpdate");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Main = function(_super) {
      __extends(Main, _super);
      function Main() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.manifest = null;
        return _this;
      }
      Main.prototype.onLoad = function() {
        this.label.string = "Here is " + cc.sys.os + ".";
        HotUpdate_1.default.instance.tryHotUpdate();
      };
      Main.prototype.onClickJump = function() {
        cc.director.loadScene("hotUpdate");
      };
      __decorate([ property(cc.Label) ], Main.prototype, "label", void 0);
      __decorate([ property(cc.Asset) ], Main.prototype, "manifest", void 0);
      Main = __decorate([ ccclass ], Main);
      return Main;
    }(cc.Component);
    exports.default = Main;
    cc._RF.pop();
  }, {
    "./HotUpdate": "HotUpdate"
  } ]
}, {}, [ "CommonUIUtils", "Config", "HotUpdate", "Main" ]);