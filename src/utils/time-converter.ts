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
