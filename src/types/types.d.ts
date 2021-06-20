declare module '*.png'
declare module '*.json'

declare interface IPlayResource {
    id: number
    type: string
    picture: string
    lang: string
    name: string
    director: string
    describe: string
    area: string
    actor: string
    class: string
    doubanId: number
    doubanScore: string
    origin: string
    remark: string
    tag: string
    year: string
    updateTime: string
    playList: { index: string[], mapper: Record<string, string> }
}

declare interface IPlayHistoryResource extends IPlayResource{
    historyPlayKey: string
    historyPlayTime: number
    historyPlayDate: number
    historyPlayDesc: string
}

declare interface IPlayCollectResource extends IPlayResource {
    collectDate: number
}

declare interface ILiveResource {
    sourceName: string
    src: string
}
