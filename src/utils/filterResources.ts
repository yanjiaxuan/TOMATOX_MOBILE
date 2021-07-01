export function filterResources(resources: any[]) {
    return resources.map(res => filterResource(res));
}

export function filterResource(resource: any): IPlayResource {
    let listStr = ''
    if (resource.dl && resource.dl[0] && resource.dl[0].dd && resource.dl[0].dd[0]) {
        const dd = resource.dl[0].dd[0]
        if (dd instanceof Array) {
            const videoList = dd.filter(item => item.$.flag && item.$.flag.includes('m3u8'))
            videoList.length && (listStr = videoList[0]._)
        } else {
            listStr = dd._
        }
    }
    return {
        id: +resource.id[0],
        type: resource.type[0],
        picture: resource.pic[0],
        lang: resource.lang[0],
        name: resource.name[0],
        director: resource.director[0],
        describe: resource.des[0],
        area: resource.area[0],
        actor: resource.actor[0],
        class: '',
        doubanId: 0,
        doubanScore: '0.0',
        origin: '',
        remark: resource.note[0],
        tag: '',
        year: resource.year[0],
        updateTime: resource.last[0],
        playList: filterPlayList(listStr),
    };
}

function filterPlayList(listStr: string) {
    const res: { index: string[], mapper: Record<string, string> } = {
        index: [],
        mapper: {},
    };

    const splitLists = listStr.split('$$$').filter(val => val.includes('.m3u'));
    if (splitLists.length) {
        splitLists[0].split('#').forEach(item => {
            const [key, val] = item.split('$');
            if (key && val) {
                res.index.push(key);
                res.mapper[key] = val;
            }
        });
    }
    return res;
}

// export function cleanResourceData(dataType: string, data: IplayResource): IplayResource {
//     const optData: IplayResource = {
//         id: data.id,
//         type: data.type,
//         picture: data.picture,
//         lang: data.lang,
//         name: data.name,
//         director: data.director,
//         describe: data.describe,
//         area: data.area,
//         actor: data.actor,
//         class: data.class,
//         doubanId: data.doubanId,
//         doubanScore: data.doubanScore,
//         origin: data.origin,
//         remark: data.remark,
//         tag: data.tag,
//         year: data.year,
//         updateTime: data.updateTime,
//         playList: data.playList
//     };
//     if (dataType === TABLES.TABLE_HISTORY) {
//         optData.historyOption = data.historyOption;
//     } else if (dataType === TABLES.TABLE_COLLECT) {
//         optData.collectOption = data.collectOption;
//     }
//     return optData;
// }
