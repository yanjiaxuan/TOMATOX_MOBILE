// ac：模式（videolist或detail详细模式），为空＝列表标准模式
// ids: 影片id，多个使用,隔开
// t: 类型
// h：最近多少小时内
// pg: 页数
// wd：搜索like
// at：输出格式，可选xml

import constants from './constants';

export function queryResources(
    curPage: number,
    type?: number,
    keyWord?: string,
    lastUpdate?: number
): any {
    return new Promise(resolve => {
        try {
            fetch(`${constants.DEFAULT_ORIGIN}?ac=videolist${curPage ? '&pg=' + curPage : ''}${type ? '&t=' + type : ''}${keyWord ? '&wd=' + keyWord : ''}${lastUpdate ? '&h=' + lastUpdate : ''}`)
                .then(res => res.json())
                .then(res => resolve(res), () => {resolve([]);})
                .catch(() => resolve([]));
        } catch (e) {
            resolve([]);
        }
    });

}

export function queryTypes() {
    return new Promise(resolve => {
        try {
            fetch(constants.DEFAULT_ORIGIN)
                .then(res => res.json())
                .then(res => {
                    resolve(res.class.map((item: {type_id: string, type_name: string}) => {
                        return {id: item.type_id, name: item.type_name};
                    }));
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