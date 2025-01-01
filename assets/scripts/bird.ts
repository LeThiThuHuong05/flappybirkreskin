// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import Game from './game'

@ccclass
export default class NewClass extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    jumpHeight: number = 100
    jumpDuration: number = 0.3
    nextFlyTime: number = 0.0

    lastAction: cc.Action = null

    game: Game


    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact: PhysicsContact, selfCollider: PhysicsCollider, otherCollider: PhysicsCollider): void {
        let node: cc.Node = otherCollider.body.node;
        if (node) {
            if (node) {
                if (node.group == "coin") {
                    this.game.addCoin();
                    node.active = false;
                }
                else {
                    this.game.gameOver()
                }
            }
        }
    }

    init(game) {
        this.game = game
        this.resetBird()
    }


    fly() {        
        const screenH = 960 // from pipe.ts
        if (this.node.position.y > screenH / 2)
        {
            this.game.gameOver()
        }
        var currentTime = (new Date()).getTime();
        if (currentTime < this.nextFlyTime)
        {
            return;
        }
        this.nextFlyTime = currentTime + 250;

        const body = this.node.getComponent(cc.RigidBody)
        body.type = cc.RigidBodyType.Static
        this.node.angle = 30;
        // this.game.jumpSfx.volume = 0.3;
        // this.game.jumpSfx.play();
        this.node.stopAction(this.lastAction)
        this.lastAction = cc.sequence(
            cc.sequence(
                cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeSineOut()),
                cc.callFunc(function (target) {
                    body.type = cc.RigidBodyType.Dynamic
                }, this)
            ),
            cc.rotateTo(this.jumpDuration, 90).easing(cc.easeIn(1.2)), // 向下俯冲
        );

        this.node.runAction(this.lastAction)
    }

    resetBird() {
        this.node.stopAction(this.lastAction)
        const body = this.node.getComponent(cc.RigidBody)
        body.type = cc.RigidBodyType.Static

        this.node.angle = 0
        this.node.y = 0
        this.node.x = 0
    }

    startBird() {
        const body = this.node.getComponent(cc.RigidBody)
        body.type = cc.RigidBodyType.Dynamic
    }

    update (dt) {
        this.node.setPosition(0, this.node.position.y);
    }
}
