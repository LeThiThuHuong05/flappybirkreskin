// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import Game from './game'
import Utils from './Util';

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    game: Game

    maxScore: number = 0 // 最大分数
    score: number = 0 // 当前分数
    coin: number = 0 // 当前分数
    life: number = 0 // 生命值

    @property(cc.Label)
    scoreLabel: cc.Label = null

    @property(cc.Label)
    lifeLabel: cc.Label = null

    @property(cc.Label)
    currentScoreLabel: cc.Label = null

    @property(cc.Label)
    bestScoreLabel: cc.Label = null

    @property(cc.Label)
    coinLabel: cc.Label = null

    @property(cc.Label)
    coinNum: cc.Label = null

    @property(cc.Label)
    curLifeLabel: cc.Label = null

    @property(cc.Sprite)
    newImg: cc.Sprite = null

    @property(cc.Button)
    reStartBtn: cc.Button = null


    init(game: Game) {
        this.game = game
        this.initResult()
    }

    initResult() {
        this.updateScore(0)
        this.updateCoin(0)
       // this.updateLife(this.life)

        this.node.active = false
        this.scoreLabel.node.active = true
        this.scoreLabel.node.zIndex = 999

        this.lifeLabel.node.active = true
        this.lifeLabel.node.zIndex = 999

        this.coinNum.node.zIndex = 999
        this.coinLabel.node.zIndex = 999
    }

    addScore() {
        this.updateScore(this.score + 1)
    }

    addCoin() {
        this.updateCoin(this.coin + 1)
    }

    addLife() {
        this.updateLife(this.life + 1)
    }

    updateCoin(num: number) {
        this.coin = num
        this.coinNum.string = this.coin.toString()
    }
    updateScore(num: number) {
        this.score = num
        this.scoreLabel.string = this.score.toString()
    }

    updateLife(num: number) {
        this.life = num
        this.lifeLabel.string = this.life.toString()
    }

    showResult() {
        this.updateLife(Math.max(0, this.life - 1))
        this.newImg.node.active = this.score > this.maxScore
        this.maxScore = Math.max(this.maxScore, this.score)
        this.scoreLabel.node.active = false
        this.node.active = true
        this.node.zIndex = 9999
        this.currentScoreLabel.string = this.score.toString()
        this.bestScoreLabel.string = this.maxScore.toString()
        this.curLifeLabel.string = this.life.toString()
        this.scoreLabel.node.active = false
        this.lifeLabel.node.active = false
        this.reStartBtn.node.active = false;//this.life > 0
    }

}
