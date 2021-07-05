// ac：模式（videolist或detail详细模式），为空＝列表标准模式
// ids: 影片id，多个使用,隔开
// t: 类型
// h：最近多少小时内
// pg: 页数
// wd：搜索like
// at：输出格式，可选xml

import constants from './constants';
import {filterResources} from './filterResources';
const parseXML = require('react-native-xml2js').parseString;
let SEARCH_INDEX: Record<string, number> = {};
const ua = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.66'
}
const customFetch = function(input: RequestInfo, init?: RequestInit): Promise<Response> {
    if (typeof input === 'string') {
        if (init) {
            init.headers = ua
            return fetch(input, init)
        } else {
            return fetch(input, { headers: ua })
        }
    } else {
        return fetch(input, { headers: ua })
    }
}

export function querySearchIndex() {
    customFetch(constants.DEFAULT_SEARCH_INDEX).then(res => {
        return res.json()
    }).then(res => {
        SEARCH_INDEX = res as any;
    });
}

export function querySearchRes(curPage: number, keyword: string) {
    return new Promise((resolve) => {
        const result: {pagecount: number, list: IPlayResource[]} = { pagecount: 1, list: [] };
        const targetIds: number[] = [];
        for (let key in SEARCH_INDEX) {
            if (key.indexOf(keyword) >= 0) {
                targetIds.push(SEARCH_INDEX[key]);
            }
        }
        if (targetIds.length === 0) {
            resolve(result);
        }
        customFetch(`${constants.DEFAULT_ORIGIN}?ac=videolist&pg=${curPage}&ids=${targetIds.join(',')}`).then(res => res.text()).then(res => {
            parseXML(res, (err: Error, data:any) => {
                const jsonData = data.rss || data;
                if (jsonData.list && jsonData.list[0] && jsonData.list[0].video) {
                    const { pagecount } = jsonData.list[0].$;
                    result.pagecount = pagecount;
                    const videoList =
                        jsonData.list[0].video instanceof Array
                            ? jsonData.list[0].video
                            : [jsonData.list[0].video];
                    result.list.push(...filterResources(videoList));
                }
                resolve(result);
            });
        });
    });
}

export function queryResources(
    curPage: number,
    type?: number,
    keyWord?: string,
    lastUpdate?: number
): any {
    return new Promise(resolve => {
        try {
            customFetch(`${constants.DEFAULT_ORIGIN}?ac=videolist${curPage ? '&pg=' + curPage : ''}${type ? '&t=' + type : ''}${keyWord ? '&wd=' + keyWord : ''}${lastUpdate ? '&h=' + lastUpdate : ''}`)
                .then(res => res.text())
                .then(res => {
                    parseXML(res, (err: Error, data:any) => {
                        const jsonData = data.rss || data;
                        if (jsonData.list && jsonData.list[0] && jsonData.list[0].video) {
                            const { pagecount } = jsonData.list[0].$;
                            const videoList =
                                jsonData.list[0].video instanceof Array
                                    ? jsonData.list[0].video
                                    : [jsonData.list[0].video];
                            resolve({ pagecount, list: filterResources(videoList) });
                        }
                        resolve({pagecount: 0, list: []});
                    });
                    resolve({pagecount: 0, list: []});
                }, () => {resolve({pagecount: 0, list: []});})
                .catch(() => resolve({pagecount: 0, list: []}));
        } catch (e) {
            resolve({pagecount: 0, list: []});
        }
    });

}

export function queryTypes() {
    return new Promise<{id: number, name: string}[]>(resolve => {
        try {
            customFetch(constants.DEFAULT_ORIGIN)
                .then(res => res.text())
                .then(res => {
                    parseXML(res, (err: Error, data: any) => {
                        const jsonData = data.rss || data;
                        const result: any = [];
                        jsonData.class[0].ty.forEach((item: any) => {
                            result.push({id: item.$.id, name: item._});
                        });
                        resolve(result);
                    });
                }, () => {resolve([]);})
                .catch(() => resolve([]));
        } catch (e) {
            resolve([]);
        }
    });
}

export function queryLive() {
    return new Promise(resolve => {
        try {
            customFetch(constants.IPTV_ORIGIN, )
                .then(res => res.json())
                .then(res => {
                    const keys = new Set<string>();
                    const result: ILiveResource[] = [];
                    (res as ILiveResource[]).forEach(item =>{
                        if (!keys.has(item.sourceName)) {
                            result.push(item);
                            keys.add(item.sourceName);
                        }
                    });
                    resolve(result);
                }, () => resolve([]))
                .catch(() => resolve([]));
        } catch (e) {
            resolve([]);
        }
    });
}
