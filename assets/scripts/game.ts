// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import pipePool from './pipePool'
import Bird from './bird'
import Ground from './ground'
import Result from './result'
import Utils from './Util';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Component)
    bird: Bird = null;

    @property(cc.Component)
    poolMng: pipePool

    @property(cc.Component)
    ground: Ground = null;

    @property(cc.Component)
    result: Result = null;
    @property(cc.Label)
    sessionId: cc.Label = null

    @property(cc.Label)
    httpResponse: cc.Label = null
    @property(cc.Label)
    versionLabel: cc.Label = null
    // @property(cc.String)
    // backURL: string = "https://d1i9y9mccibpvo.cloudfront.net/?token=TOKEN"
    @property(cc.String)
    mainSiteURL: string = "https://d1h921b82byyoa.cloudfront.net"

    @property(cc.String)
    endPoint: string = "http://18.141.179.95/api/game/record-points"

    @property(cc.String)
    urlParameterName: string = "sessionId"

    @property(cc.String)
    urlBestScoreParamName: string = "bestScore"

    @property(cc.String)
    urlTotalLifeParamName: string = "totalLife"

    @property(cc.String)
    urlRemainingPlaysParamName: string = "remainingPlays"

    @property(cc.String)
    urlTotalPointsParamName: string = "totalPoints"

    @property(cc.String)
    version: string = ""

    @property(cc.AudioSource)
    bgm: cc.AudioSource = null
    @property(cc.AudioSource)
    coinSfx: cc.AudioSource = null
    @property(cc.AudioSource)
    jumpSfx: cc.AudioSource = null
    @property(cc.AudioSource)
    loseSfx: cc.AudioSource = null

    speed: number = 200 // 运行速度
    gravity: cc.Vec2 = cc.v2(0, -980 * 2) // 重力
    isStart: boolean = false // 是否开始
    isOver: boolean = false // 是否结束
    coin: number = 0;
    life: number = 0;
    maxScore: number = 0;


    onLoad() {
        this.bird = this.bird.getComponent('bird')
        this.bird.init(this)

        this.poolMng = this.poolMng.getComponent('pipePool')
        this.poolMng.init(this)

        this.ground = this.ground.getComponent('ground')
        this.ground.init(this)

        this.result = this.result.getComponent('result')
        this.result.init(this)

        this.initPhysicsManager()
        this.initListener()
        this.sessionId.node.zIndex = cc.macro.MAX_ZINDEX;
        this.httpResponse.node.zIndex = cc.macro.MAX_ZINDEX;
        this.versionLabel.node.zIndex = cc.macro.MAX_ZINDEX;
        // this.sessionId.string = "SessionId : " + Utils.getQueryParam(window.location.href, "token");
        this.sessionId.string = window.location.href;
        this.initResult();
        // let token = Utils.getQueryParam(window.location.href, "token");
        // if (token) {
        //     this.backURL = this.backURL.replace("TOKEN", token);
        // }
        if (this.version != "") {
            this.versionLabel.string = this.version;
        }
    }

    initResult() {
        const lifeString = Utils.getQueryParam(window.location.href, this.urlRemainingPlaysParamName);
        this.life = parseInt(lifeString != null ? lifeString : '5');
        const maxScoreString = Utils.getQueryParam(window.location.href, this.urlBestScoreParamName)
        this.maxScore = parseInt(maxScoreString != null ? maxScoreString:'0');
        this.result.updateLife(this.life);
        this.result.maxScore = this.maxScore;

        console.log("bestScore: ", maxScoreString, " - remainingPlays: ", lifeString);
    }


    initPhysicsManager() {
        const instance = cc.director.getPhysicsManager()
        instance.enabled = true
        // instance.debugDrawFlags = 4 // 调试模式
        instance.gravity = this.gravity;
        const collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true
    }

    initListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.isOver) return

            if (!this.isStart) this.startGame()

            this.bird.fly()
        })
    }

    startGame() {
        this.isStart = true
        this.bird.startBird()
        this.createPipe()
        cc.director.resume()
    }


    createPipe() {
        const node = this.poolMng.createPipe()
        if (node) {
            this.node.addChild(node);
        }
    }

    passPipe() {
        this.result.addScore()
    }

    gameOver() {
        this.bgm.stop();
        this.loseSfx.play();
        this.isOver = true
        console.log('碰到障碍，游戏结束')
        this.SendScoreToLeaderBoard();
        this.result.showResult()
        cc.director.pause()
    }
    private SendScoreToLeaderBoard() {
        var sessionId = Utils.getQueryParam(window.location.href, this.urlParameterName);
        console.log("Session ID =" + sessionId)
        if (sessionId != null) 
            {
            let data = {
                sessionId: sessionId,
                earnedPoints: this.result.score
            }
            let _t = this;
            Utils.sendPostRequest(this.endPoint, data, (err, response) => {
                if (err) {
                    _t.httpResponse.string = " Error : " + err;
                    console.error("sendPostRequest Error:", err);
                } else {
                    _t.httpResponse.string = " Success : " + response;
                    console.log("sendPostRequest Response:", response);
                }
            });
        }
    }
    addCoin() {
        this.coin++;
        console.log(this.coin)
        this.result.addScore()
        this.coinSfx.volume = 0.3;
        this.coinSfx.play();
    }
    resStartGame() {
        this.bgm.play();
        this.isStart = false
        this.isOver = false
        this.coin = 0;
        this.httpResponse.string = "";
        this.result.initResult()
        this.poolMng.reset()
        this.bird.resetBird()
        cc.director.resume()
    }
    goToMainSite() {
        Utils.openURL(this.mainSiteURL);
    }
}
