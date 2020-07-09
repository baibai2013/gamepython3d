// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Motionstreak extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        if(this.target){
            this.node.x = this.target.x;
            this.node.y = this.target.y;
            this.node.z = this.target.z;
        }
    }
}
