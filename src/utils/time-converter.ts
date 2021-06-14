function fix2(num: number) {
    return (num < 10 ? '0' : '') + num
}

export function convertSecondToTime(date: number, full: number) {
    const useHours = full > 3600
    let handleTime = date;
    let target = '';
    if (useHours) {
        const hours = Math.floor(handleTime / 3600);
        target += hours < 10 ? `0${hours}:` : `${hours}:`;
        handleTime = handleTime % 3600;
    }
    const minutes = Math.floor(handleTime / 60);
    target += minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    handleTime = Math.floor(handleTime % 60);
    target += handleTime < 10 ? `0${handleTime}` : `${handleTime}`;

    return target;
}

export function convertTimestampToDate(timestamp: number) {
    const date = new Date(timestamp)

    return `${date.getFullYear()}-${fix2(date.getMonth() + 1)}-${fix2(date.getDate())} ${fix2(date.getHours())}:${fix2(date.getMinutes())}`
}
