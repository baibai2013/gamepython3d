// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MainScene from "./MainScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Sphere extends cc.Component {



    static R_TO_D = 180 / Math.PI

    @property(cc.Prefab)
    bodyPrefab: cc.Prefab = null

     //目标位置快照
     prePostionSnapshot: cc.Vec3[] = []
     //开始位置快照
     startPostionSnapshot: cc.Vec3[] = []
     //开始位置到目标位置的距离
     distanceSnapshot: number[] = []

    tempVec2: cc.Vec3 = cc.Vec3.ZERO
    tempVec: cc.Vec2 = cc.Vec2.ZERO
    tempAngles: cc.Vec3 = cc.Vec3.ZERO
    mainScene: MainScene
    speed = 400
    _direction: cc.Vec3 = new cc.Vec3(1, 0, 0)
    set direction(direction: cc.Vec3) {
        this._direction = direction.normalizeSelf()
        this.tempVec.x = direction.x
        this.tempVec.y = direction.z
        this.tempAngles.y = this.tempVec.signAngle(cc.Vec2.RIGHT) * Sphere.R_TO_D
        this.node.eulerAngles =this.tempAngles
    }
    get direction(): cc.Vec3 {
        return this._direction
    }
    // LIFE-CYCLE CALLBACKS:
    bodys: cc.Node[] = []

    onLoad() {
        let collider = this.getComponent(cc.Collider3D)
        collider.on('trigger-enter', this.triggerEnter, this)
        collider.on('collision-enter', this.collistionEnter, this)
    }

    addBody() {
        let newBody: cc.Node = cc.instantiate(this.bodyPrefab)
        newBody.setPosition(this.node.x, this.node.y,this.node.z)
        this.node.parent.addChild(newBody)
        let delta = this._direction.mul(newBody.width*20)
        this.node.setPosition(this.node.x + delta.x, this.node.y + delta.y,this.node.z + delta.z)
        this.bodys.push(newBody)
    }

    collistionEnter(event){
        console.log(event.type, event);
       
    }

    triggerEnter(event) {
        console.log(event.type, event);

        if(event.otherCollider.node.name == "wall1" ||event.otherCollider.node.name == "wall2"){
            this.direction= cc.v3(-this._direction.x,this._direction.y,this._direction.z)
            return
        }

        if(event.otherCollider.node.name == "wall3" ||event.otherCollider.node.name == "wall4"){
            this.direction= cc.v3(this._direction.x,this._direction.y,-this._direction.z)
            return
        }

        event.otherCollider.node.destroy()
        this.addBody()
        if (this.mainScene) {
            this.mainScene.eatFood()
        }
    }

    start() {

        this.schedule(this.initBody, 0.01, 4, 0.01)

    }


    initBody(dt) {
        this.addBody()
        // cc.log("initBody"+ this.initCount)
    }

    update(dt) {



        //head
        this.node.x += this._direction.x * this.speed * dt
        this.node.z += this._direction.z * this.speed * dt

        //body
        let tempVec3 = this.tempVec2
        let bodySpeed = this.speed * dt * 3
        for (let i = 0; i < this.bodys.length; i++) {
            //初始化每个关节的的目标点快照、起始位置快照、起始位置到目标点距离
            if (!this.prePostionSnapshot[i]) {
                let preNode = this.bodys[i + 1]
                if (!preNode) {
                    preNode = this.node
                }
                // this.prePostionSnapshot[i] = cc.Vec2.ZERO
                this.prePostionSnapshot[i] = preNode.position
                // this.startPostionSnapshot[i] = cc.Vec2.ZERO
                this.startPostionSnapshot[i] = this.bodys[i].position
                tempVec3.set(this.prePostionSnapshot[i])
                this.distanceSnapshot[i] = tempVec3.subSelf(this.startPostionSnapshot[i]).mag()
            }

            //每个关节当前行驶的距离
            tempVec3.x = this.bodys[i].x
            tempVec3.y = this.bodys[i].y
            tempVec3.z = this.bodys[i].z
            let totalDist = tempVec3.subSelf(this.startPostionSnapshot[i]).mag()
            //如果行驶的距离达到预计的距离，更新目标点快照、起始位置快照、起始位置到目标点距离
            if (totalDist >= this.distanceSnapshot[i] - 0.1) {
                let preNode = this.bodys[i + 1]
                if (!preNode) {
                    preNode = this.node
                }
                this.prePostionSnapshot[i].x = preNode.x
                this.prePostionSnapshot[i].y = preNode.y
                this.prePostionSnapshot[i].z = preNode.z
                this.startPostionSnapshot[i].x = this.bodys[i].x
                this.startPostionSnapshot[i].y = this.bodys[i].y
                this.startPostionSnapshot[i].z = this.bodys[i].z
                tempVec3.set(this.prePostionSnapshot[i])
                this.distanceSnapshot[i] = tempVec3.subSelf(this.startPostionSnapshot[i]).mag()
            }

            //起始位置到目标点的向量
            tempVec3.set(this.prePostionSnapshot[i])
            tempVec3.subSelf(this.startPostionSnapshot[i])
            let body = this.bodys[i]
            if (body) {
                if (tempVec3.x == 0 && tempVec3.z == 0){}else{
                    this.tempVec.x = tempVec3.x
                    this.tempVec.y = tempVec3.z
                    this.tempAngles.y = this.tempVec.signAngle(cc.Vec2.RIGHT) * Sphere.R_TO_D
                    body.eulerAngles =this.tempAngles
                }
                //身体移动一份目标向量大小
                tempVec3.divSelf(bodySpeed)
                body.setPosition(body.x + tempVec3.x, body.y + tempVec3.y, body.z + tempVec3.z)

            }
        }

    }
}
