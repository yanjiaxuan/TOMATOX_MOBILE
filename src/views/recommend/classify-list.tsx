import React, {useEffect, useState} from "react";
import TomatoxWaterfall from "../../components/tomatox-waterfall/tomatox-waterfall";
import {queryResources} from "../../utils/request";
import {filterResources} from "../../utils/filterResources";

export default function classifyList(props: {type: number, navigation: any}) {
    const [resourceList, setResourceList] = useState<IplayResource[]>([])
    const [haveMoreData, setHaveMoreData] = useState(true)
    const [curPage, setCurPage] = useState(0)
    const [pageCount, setPageCount] = useState(10)
    useEffect(() => {
        getMoreData()
    }, [])

    const getMoreData = () => {
        let prom;
        setCurPage(curPage + 1)
        if (curPage >= pageCount) {
            setHaveMoreData(false)
            return
        }
        if (props.type === -1) {
            prom = queryResources(curPage, undefined, undefined, 24)
        } else {
            prom = queryResources(curPage, props.type)
        }
        prom.then((res: any) => {
            const {pagecount, list} = res
            if (curPage >= pagecount) {
                setHaveMoreData(false)
            }
            setPageCount(pagecount)
            setResourceList([
                ...resourceList,
                ...filterResources(list)
            ])
        })
    }

    return (
        <TomatoxWaterfall
            loadMore={getMoreData}
            data={resourceList}
            navigation={props.navigation}
            haveMoreData={haveMoreData}
        />
    )
}
