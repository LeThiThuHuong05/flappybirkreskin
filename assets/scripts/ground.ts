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

    @property(cc.Prefab)
    groundTile: cc.Prefab
    @property(cc.Node)
    mountain1: cc.Node
    @property(cc.Node)
    mountain2: cc.Node


    game: Game
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initGround()
    }

    init(game: Game) {
        this.game = game
    }

    // 初始化滴管
    initGround() {
        for (let i = -36; i <= 36; ++i) {
            let tile = cc.instantiate(this.groundTile);
            tile.x = i * 21
            this.node.addChild(tile)
        }
    }

    update(dt) {
        // 地面移动动画
        const speed = this.game.speed * dt
        this.node.x -= speed
        if (this.node.x < -320) {
            this.node.x += 320 - 18.5
        }
        this.mountain1.x -= speed;
        if (this.mountain1.x < -568) {
            this.mountain1.x = 568;
        }
        this.mountain2.x -= speed;
        if (this.mountain2.x < -568) {
            this.mountain2.x = 568;
        }
    }

}
