// ac：模式（videolist或detail详细模式），为空＝列表标准模式
// ids: 影片id，多个使用,隔开
// t: 类型
// h：最近多少小时内
// pg: 页数
// wd：搜索like
// at：输出格式，可选xml

import constants from "./constants";

export function queryResources(
    curPage: number,
    type?: number,
    keyWord?: string,
    lastUpdate?: number
): any {
    return fetch(`${constants.DEFAULT_ORIGIN}?ac=videolist${curPage ? '&pg=' + curPage : ''}${type? '&t=' + type : ''}${keyWord? '&wd=' + keyWord: ''}${lastUpdate ? '&h=' + lastUpdate : ''}`).
        then(res => res.json())
}

export function queryTypes() {
    return fetch(constants.DEFAULT_ORIGIN)
        .then(res => res.json())
        .then(res => res.class.map((item: {type_id: string, type_name: string}) => {
            return { id: item.type_id, name: item.type_name }
        }));
}