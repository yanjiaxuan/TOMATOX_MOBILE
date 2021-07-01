// ac：模式（videolist或detail详细模式），为空＝列表标准模式
// ids: 影片id，多个使用,隔开
// t: 类型
// h：最近多少小时内
// pg: 页数
// wd：搜索like
// at：输出格式，可选xml

import constants from './constants';
import {filterResources} from "./filterResources";
const parseXML = require('react-native-xml2js').parseString

export function queryResources(
    curPage: number,
    type?: number,
    keyWord?: string,
    lastUpdate?: number
): any {
    return new Promise(resolve => {
        try {
            fetch(`${constants.DEFAULT_ORIGIN}?ac=videolist${curPage ? '&pg=' + curPage : ''}${type ? '&t=' + type : ''}${keyWord ? '&wd=' + keyWord : ''}${lastUpdate ? '&h=' + lastUpdate : ''}`)
                .then(res => res.text())
                .then(res => {
                    parseXML(res, (err: Error, data:any) => {
                        const jsonData = data.rss || data
                        if (jsonData.list && jsonData.list[0] && jsonData.list[0].video) {
                            const { pagecount } = jsonData.list[0].$
                            const videoList =
                                jsonData.list[0].video instanceof Array
                                    ? jsonData.list[0].video
                                    : [jsonData.list[0].video]
                            resolve({ pagecount, list: filterResources(videoList) })
                        }
                    })
                    resolve([])
                }, () => {resolve([]);})
                .catch(() => resolve([]));
        } catch (e) {
            resolve([]);
        }
    });

}

export function queryTypes() {
    return new Promise<{id: number, name: string}[]>(resolve => {
        try {
            fetch(constants.DEFAULT_ORIGIN)
                .then(res => res.text())
                .then(res => {
                    parseXML(res, (err: Error, data: any) => {
                        const jsonData = data.rss || data
                        const result: any = []
                        jsonData.class[0].ty.forEach((item: any) => {
                            result.push({id: item.$.id, name: item._})
                        })
                        resolve(result)
                    })
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
            fetch(constants.IPTV_ORIGIN)
                .then(res => res.json())
                .then(res => {
                    const keys = new Set<string>();
                    const result: ILiveResource[] = [];
                    (res as ILiveResource[]).forEach(item =>{
                        if (!keys.has(item.sourceName)) {
                            result.push(item)
                            keys.add(item.sourceName)
                        }
                    })
                    resolve(result)
                }, () => resolve([]))
                .catch(() => resolve([]))
        } catch (e) {
            resolve([])
        }
    })
}