export function convertDataFromDB(realmObj: Realm.Object|undefined): IPlayCollectResource|IPlayHistoryResource|undefined {
    if (!realmObj) return
    const data = {};
    realmObj.keys().forEach(key => {
        if (key === 'playList') {
            // @ts-ignore
            data[key] = JSON.parse(realmObj[key]);
        } else {
            // @ts-ignore
            data[key] = realmObj[key];
        }
    });
    return data as any;
}

export function convertDataToDB(data: IPlayCollectResource|IPlayHistoryResource) {
    return {
        ...data,
        playList: JSON.stringify(data.playList),
    };

}
