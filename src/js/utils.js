export const convertStringToTitle = str => {
    str = str.replace(/-/g, ' ');
    str = str.charAt(0).toUpperCase() + str.slice(1);

    return str;
}

export const convertMapToObjectsArray = (map) => {
    const arr = [];

    for(let [key, value] of map) {
        const temp = {
            "key": key, 
            "value": value
        };

        arr.push(temp);
    }

    return arr;
}

export const convertObjectsArrayToMap = (objectsArray) => {
    const map = new Map();

    for(let obj of objectsArray) {
        map.set(obj.key, obj.value);
    }

    return map;
}