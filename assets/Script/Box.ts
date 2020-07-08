// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MainScene from "./MainScene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Box extends cc.Component {

   

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    

    start () {
        this.scheduleOnce(()=>{
            this.node.destroy()
        },10)
    }

    // update (dt) {}
}
