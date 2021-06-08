declare module '*.png'

declare interface IplayResource {
    id: string;
    type: string;
    picture: string;
    lang: string;
    name: string;
    director: string;
    describe: string;
    area: string;
    actor: string;
    class: string;
    doubanId: string;
    doubanScore: string;
    origin: string;
    remark: string;
    tag: string;
    year: string;
    updateTime: string;
    playList: Map<string, string>;
    historyOption?: {
        lastPlaySrc?: string;
        lastPlayTime?: number;
        lastPlayDate?: number;
        lastPlayDrama?: string;
        lastPlayDesc?: string;
    };
    collectOption?: {
        collectDate?: number;
    };
}
