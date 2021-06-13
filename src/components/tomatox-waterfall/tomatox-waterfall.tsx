import React, {useEffect, useRef, useState} from 'react';
import TomatoxFlatList from '../../components/tomatox-flat-list/tomatox-flat-list';
import {queryResources} from '../../utils/request';
import {filterResources} from '../../utils/filterResources';

export default function tomatoxWaterfall(props: {type?: number, keyword?: string}) {
    const [resourceList, setResourceList] = useState<IplayResource[]>([]);
    const [haveMoreData, setHaveMoreData] = useState(true);
    const curPageRef = useRef(0)
    const pageCountRef = useRef(10)
    const curKeywordRef = useRef(props.keyword)

    /**
     * @param init
     * record a problem about useState here
     * I try to use state hook create curPage,pageCount in previous version
     * when father component change keyword, this component will rerender
     * and I use curKeywordRef to judge whether keyword is changed and reset this component's state then invoke getMoreData()
     * but when I setState and sync invoke getMoreDate(), I find setState not success when i judge in getMoreData
     * that means setState is an async function and it no callback or promise, what the hell!
     * So I use refHook instead stateHook to make update sync.
     * You can also use effectHook just like vue watch param to watch state change,
     * but it's not a good idea in this scene, because this component's state may be updated by more than one function,
     * that means very easy to make this component infinite rerender.
     * So, if a param will not used to update view, you shouldn't define it by stateHook
     * if you need param cross component, use refHook define it, otherwise, just define a normal parameter
     */
    const getMoreData = (init: boolean) => {
        console.log('getMoreData', init)
        if (init) {
            setHaveMoreData(true)
            curPageRef.current = 0
            pageCountRef.current = 10
            setResourceList([])
        }
        let prom;
        curPageRef.current = curPageRef.current + 1
        if (curPageRef.current >= pageCountRef.current) {
            setHaveMoreData(false);
            return;
        }
        if (props.type != null) {
            if (props.type === -1) {
                prom = queryResources(curPageRef.current, undefined, undefined, 24);
            } else {
                prom = queryResources(curPageRef.current, props.type);
            }
        } else if (curKeywordRef.current) {
            prom = queryResources(curPageRef.current, undefined, curKeywordRef.current);
        } else {
            setHaveMoreData(false)
            setResourceList([])
            return;
        }

        prom.then((res: any) => {
            const {pagecount, list} = res;
            if (curPageRef.current >= pagecount) {
                setHaveMoreData(false);
            }
            pageCountRef.current = pagecount
            setResourceList(init ?
                [...filterResources(list)] :
                [...resourceList, ...filterResources(list)]
            );
        });
    };

    useEffect(() => {
        getMoreData(true)
    }, []);

    if (curKeywordRef.current !== props.keyword) {
        curKeywordRef.current = props.keyword
        getMoreData(true)
    }

    return (
        <TomatoxFlatList
            loadMore={() => getMoreData(false)}
            data={resourceList}
            haveMoreData={haveMoreData}
        />
    );
}
