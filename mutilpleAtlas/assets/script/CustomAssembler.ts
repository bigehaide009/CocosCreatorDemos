import GTSimpleSpriteAssembler2D from "./GTSimpleSpriteAssembler2D";

const {ccclass, property} = cc._decorator;

//@ts-ignore
let gfx = cc.gfx;
let vfmtCustom = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
    { name: "a_texture_idx", type: gfx.ATTR_TYPE_FLOAT32, num: 1 }
]);

@ccclass
export default class CustomAssembler extends GTSimpleSpriteAssembler2D {
    verticesCount = 4;
    indicesCount = 6;

    uvOffset = 2;
    colorOffset: 4;
    idxOffset = 5;

    floatsPerVert = 6;

    initData() {
        let data = this._renderData;
        // createFlexData支持创建指定格式的renderData
        data.createFlexData(0, this.verticesCount, this.indicesCount, this.getVfmt());

        // createFlexData不会填充顶点索引信息，手动补充一下
        let indices = data.iDatas[0];
        let count = indices.length / 6;
        for (let i = 0, idx = 0; i < count; i++) {
            let vertextID = i * 4;
            indices[idx++] = vertextID;
            indices[idx++] = vertextID+1;
            indices[idx++] = vertextID+2;
            indices[idx++] = vertextID+1;
            indices[idx++] = vertextID+3;
            indices[idx++] = vertextID+2;
        }
    }

    // 自定义格式以getVfmt()方式提供出去，除了当前assembler，render-flow的其他地方也会用到
    getVfmt() {
        return vfmtCustom;
    }

    getBuffer() {
        //@ts-ignore
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }

    updateTextureIdx(textureIdx: number) {
        let verts = this._renderData.vDatas[0];
        let idx: number = this.idxOffset;
        for(let i = 0; i < this.verticesCount; ++i) {
            verts[idx + i * this.floatsPerVert] = textureIdx;
        }
    }
}
