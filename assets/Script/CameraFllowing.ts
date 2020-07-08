// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFllowing extends cc.Component {


    height = 1800

    @property(cc.Node)
    targetNode: cc.Node = null;

    private _following: boolean = true

    speed: number = 420
    prePosition: cc.Vec3 = cc.Vec3.ZERO
    startPosition: cc.Vec3 = cc.Vec3.ZERO
    distance: cc.Vec3 = cc.Vec3.ZERO
    distanceSnapshot: number = 0

    start() {

    }

    update(dt) {
        if (!this.targetNode || !this._following) {
            return
        }

        let distance = this.distance

        if (this.prePosition.x == 0 && this.prePosition.y == 0) {
            this.prePosition.x = this.targetNode.x
            this.prePosition.y = this.targetNode.y + this.height
            this.prePosition.z = this.targetNode.z + this.height / Math.tan(-this.node.eulerAngles.x)

            this.startPosition.x = this.node.x
            this.startPosition.y = this.node.y
            this.startPosition.z = this.node.z
            distance.set(this.prePosition)
            this.distanceSnapshot = distance.subSelf(this.startPosition).mag()
        }

        distance.x = this.node.x
        distance.y = this.node.y
        distance.z = this.node.z
        let totalDistance = distance.subSelf(this.startPosition).mag()
        if (totalDistance >= this.distanceSnapshot - 0.1) {
            this.prePosition.x = this.targetNode.x
            this.prePosition.y = this.targetNode.y + this.height
            this.prePosition.z = this.targetNode.z + this.height / Math.tan(-this.node.eulerAngles.x)

            this.startPosition.x = this.node.x
            this.startPosition.y = this.node.y
            this.startPosition.z = this.node.z
            distance.set(this.prePosition)
            this.distanceSnapshot = distance.subSelf(this.startPosition).mag()
        }
        distance.set(this.prePosition)
        let direction = distance.subSelf(this.startPosition)
        direction.divSelf(this.speed * 2.2 * dt)
        this.node.setPosition(this.node.x + direction.x, this.node.y + direction.y, this.node.z + direction.z)
    }
}
