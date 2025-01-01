// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Decor extends cc.Component {

    @property([cc.Node])
    decors:cc.Node[] = [];

    @property(cc.Float)
    randomY: number = 100;

    @property(cc.Float)
    speed: number = 100;


    defaultY: number = 100;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.defaultY = this.node.y;
    }

    update (dt) {
        const speed = this.speed * dt
        this.node.x -= speed
        if (this.node.x < -600)
        {
            for (const element of this.decors) {
                element.active = false;
            }
            let decorId =  Math.floor(Math.random() * this.decors.length);
            this.decors[decorId].active = true;
            decorId =  Math.floor(Math.random() * this.decors.length);
            this.decors[decorId].active = true;
            
            this.node.x = 600;
            let randY =  Math.random() * (this.randomY - (0)) + (0);
            this.node.y = this.defaultY + randY;
        }
        
    }
}
