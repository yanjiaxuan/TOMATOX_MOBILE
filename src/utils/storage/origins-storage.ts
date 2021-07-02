import {realm} from './storage';
import {TABLE_NAME} from './table-define';

export function addOrigin(origin: IOrigin) {
    realm?.write(() => {
        realm?.create(TABLE_NAME.TOMATOX_ORIGINS, origin);
    });
}

export function deleteOrigin(id: string) {
    realm?.delete(realm?.objectForPrimaryKey(TABLE_NAME.TOMATOX_ORIGINS, id));
}

export function changeActiveOrigin(id: string) {
    realm?.write(() => {
        realm?.objects(TABLE_NAME.TOMATOX_ORIGINS).forEach(i => {
            const item = i as unknown as IOrigin;
            item.active = item.id === id
        })
    })
}

export function queryAllOrigins(): IOrigin[] {
    const res = realm?.objects(TABLE_NAME.TOMATOX_ORIGINS).map(i => {
        const item = i as unknown as IOrigin;
        return {
            id: item.id,
            url: item.url,
            active: item.active,
            timestamp: item.timestamp
        };
    }) as IOrigin[];
    return res || []
}
