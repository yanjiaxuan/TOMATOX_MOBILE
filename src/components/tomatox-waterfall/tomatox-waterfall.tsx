import React, {useEffect, useRef, useState} from 'react';
import TomatoxFlatList from '../../components/tomatox-flat-list/tomatox-flat-list';
import {queryResources} from '../../utils/request';
import {filterResources} from '../../utils/filterResources';

export default function tomatoxWaterfall(props: {type?: number, keyword?: string}) {
    const [resourceList, setResourceList] = useState<IplayResource[]>([]);
    const [haveMoreData, setHaveMoreData] = useState(true);
    const [curPage, setCurPage] = useState(0);
    const [pageCount, setPageCount] = useState(10);
    const curKeyword = useRef(props.keyword)

    const getMoreData = () => {
        let prom;
        setCurPage(curPage + 1);
        if (curPage >= pageCount) {
            setHaveMoreData(false);
            return;
        }
        if (props.type != null) {
            if (props.type === -1) {
                prom = queryResources(curPage, undefined, undefined, 24);
            } else {
                prom = queryResources(curPage, props.type);
            }
        } else if (props.keyword) {
            prom = queryResources(curPage, undefined, props.keyword);
        } else {
            setHaveMoreData(false)
            setResourceList([])
            return;
        }

        prom.then((res: any) => {
            const {pagecount, list} = res;
            if (curPage >= pagecount) {
                setHaveMoreData(false);
            }
            setPageCount(pagecount);
            setResourceList([
                ...resourceList,
                ...filterResources(list),
            ]);
        });
    };

    const initOrResetComponent = () => {
        setResourceList([])
        setHaveMoreData(true)
        setCurPage(0)
        setPageCount(10)
        getMoreData()
    }

    useEffect(() => {
        initOrResetComponent()
    }, []);

    if (curKeyword.current !== props.keyword) {
        curKeyword.current = props.keyword
        initOrResetComponent()
    }

    return (
        <TomatoxFlatList
            loadMore={getMoreData}
            data={resourceList}
            haveMoreData={haveMoreData}
        />
    );
}
