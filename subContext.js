define("myOpenDataContext/Cache.js", function(require, module, exports){
class Cache{

    constructor(destroyFunc){
        this._pool = {}
        // 销毁值的方法
        this._destroyFunc = destroyFunc;
        this._id = 0;
    }

    get(key){
        return this._pool[key];
    }

    put(key, value){
        // 如果之前的缓存中存在值，则先销毁
        this.delete(key);
        this._pool[key] = value;
    }

    add(value){
        this.delete(this._id);
        this._pool[this._id] = value;
        this._id++;
        return this._id - 1;
    }

    delete(key){
        if(!this._pool[key]){
            return;
        }
        if (typeof this._destroyFunc === 'function') {
            this._destroyFunc(this._pool[key])
        }
        delete this._pool[key];
    }

    clear(){
        if(typeof this._destroyFunc === 'function'){
            const keys = Object.keys(this._pool);
            keys.forEach((key) => this.delete(key));
        }
        this._pool = {};
    }
}

module.exports = Cache;
});
define("myOpenDataContext/index.js", function(require, module, exports){
const Cache = require("./Cache");

const imgCache = new Cache((img)=>img.src="");
const canvasCache = new Cache((canv)=>canv.destroy());

// 主角的openID
let openID = 0;

//分数存储的Key
let scoreKeyPre = 'ScoreZero';         //上一个赛季的key
let scoreKeyNow = 'ScoreOne';       //当前赛季的key     --限制：纯英文，赛季更新的时候需要将其设置为上一个赛季的key

class RankListRenderer {

    constructor(width, height) {
    }

    init() {
    }

    listen() {
        qq.onMessage(message => {
            let data = message.data;
            // console.log('-----------------');
            // console.log(JSON.stringify(message));
            switch (message.cmd) {
                case "updateScore": {
                    let info = {};
                    info.key = scoreKeyNow;
                    info.value = data + '';
                    qq.setUserCloudStorage({
                        KVDataList: [info],
                        success: function (msg) {
                            console.log('上传分数成功 ' + data);
                        },
                        fail: function (msg) {
                            console.log('上传分数失败 ' + JSON.stringify(msg));
                        }
                    });

                    // wx.getFriendCloudStorage({
                    //     keyList: [scoreKeyPre, scoreKeyNow],
                    //     success: (res) => {
                    //         console.log("排行数据：？？？？？？？？？？？？");
                    //         const data = res.data;
                    //         console.log(JSON.stringify(data));
                    //     }
                    // });
                }break;
            }
        });
    }
}

const renderer = new RankListRenderer(503,625);
renderer.listen();
});  require("myOpenDataContext/index.js");