const abstractTableDefine = {
    id: 'int',
    type: 'string',
    picture: 'string',
    lang: 'string',
    name: 'string',
    director: 'string',
    describe: 'string',
    area: 'string',
    actor: 'string',
    class: 'string',
    doubanId: 'int',
    doubanScore: 'string',
    origin: 'string',
    remark: 'string',
    tag: 'string',
    year: 'string',
    updateTime: 'string',
    playList: 'string'
}

export const TABLE_NAME = {
    TOMATOX_HISTORY: 'TOMATOX_HISTORY',
    TOMATOX_COLLECT: 'TOMATOX_COLLECT'
}

export const TABLE_DEFINE = {
    TOMATOX_HISTORY: {
        name: TABLE_NAME.TOMATOX_HISTORY,
        primaryKey: 'id',
        properties: {
            ...abstractTableDefine,
            historyPlayKey: 'string',
            historyPlayTime: 'int',
            historyPlayDate: {type: 'int', indexed: true},
            historyPlayDesc: 'string'
        }
    },
    TOMATOX_COLLECT: {
        name: TABLE_NAME.TOMATOX_COLLECT,
        primaryKey: 'id',
        properties: {
            ...abstractTableDefine,
            collectDate: 'int'
        }
    }
}
