import Realm from 'realm';
import {TABLE_DEFINE, TABLE_NAME} from './table-define';
import {convertDataFromDB, convertDataToDB} from "./data-converter";

const ONE_WEEK = 7 * 24 * 3600 * 1000
let realm: Realm | undefined;
export default async function initStorage() {
    realm = await Realm.open({
        path: 'tomatox',
        schemaVersion: 1,
        schema: [TABLE_DEFINE.TOMATOX_COLLECT, TABLE_DEFINE.TOMATOX_HISTORY],
    });
    cleanOutdateData()
}

export function cleanOutdateData() {
    const now = Date.now()
    realm?.write(() => {
        // @ts-ignore
        const needDeleted = realm?.objects(TABLE_NAME.TOMATOX_HISTORY).filter(item => now - item.historyPlayDate > ONE_WEEK)
        realm?.delete(needDeleted)
    })
}

export function insertOrUpdateData(tableName: string, data: IPlayHistoryResource|IPlayCollectResource) {
    const storeConvertData = convertDataToDB(data)
    realm?.write(() => {
        const object = realm?.objectForPrimaryKey(tableName, storeConvertData.id);
        if (!object) {
            realm?.create(tableName, storeConvertData);
        } else {
            Object.keys(storeConvertData).forEach(key => {
                // @ts-ignore
                key !== 'id' && (object[key] = storeConvertData[key]);
            });
        }
    });
}

export function queryData(tableName: string, id: number): IPlayHistoryResource|IPlayCollectResource|undefined {
    const res = realm?.objectForPrimaryKey(tableName, id);
    return convertDataFromDB(res);
}

export function queryAll(tableName:string): (IPlayHistoryResource | IPlayCollectResource | undefined)[] | undefined {
    return realm?.objects(tableName).map(item => convertDataFromDB(item));
}

export function deleteData(tableName: string, id: number) {
    realm?.write(() => {
        realm?.delete(realm?.objectForPrimaryKey(tableName, id));
    });
}
