import Sphere from "./Sphere";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;


    @property(Sphere)
    sphereNode: Sphere = null;

    @property(cc.Prefab)
    boxPrefab: cc.Prefab = null;

    @property(cc.Node)
    planeNode: cc.Node = null;

    @property(cc.Node)
    rootNode: cc.Node = null;

    touchDown: cc.Vec2 = cc.Vec2.ZERO
    sphere: Sphere = null

    count: number = 0

    onLoad() {
        cc.director.getPhysics3DManager().enabled = true;
        this.sphere = this.sphereNode.getComponent(Sphere)
        this.sphere.mainScene = this

        cc.log('onLoad')
        this.node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            this.touchDown.set(event.getLocation())
        }, this)

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event: cc.Event.EventTouch) {
            let delta: cc.Vec2 = event.getDelta()
            if (delta.mag() >= 2) {
                let derection2d = event.getLocation().subSelf(this.touchDown)
                this.sphere.direction = cc.v3(derection2d.x, 0, -derection2d.y)
            }
        }, this)

        this.schedule(this.addBox, 3, cc.macro.REPEAT_FOREVER, 3)
    }

    addBox() {

        let box = cc.instantiate(this.boxPrefab)
        box.y = -56;
        box.x = this.getRandomRange(this.planeNode.x - 1000, this.planeNode.x + 1000,)
        box.z = this.getRandomRange(this.planeNode.z - 1000, this.planeNode.z + 1000,)
        this.rootNode.addChild(box)
    }

    eatFood() {
        this.count++
        this.label.string = "count:"+this.count
    }

    getRandomRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
}
