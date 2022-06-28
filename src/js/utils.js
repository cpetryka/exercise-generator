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

// export const convertMapToString = (map) => {
//     let txt = '';

//     map.forEach((v, k) => {
//         txt += `${k},${v};`;
//     });

//     txt = txt.slice(0, txt.length - 1);

//     return txt;
// }

// export const convertArrToMap = (arr) => {
//     let map = new Map();

//     for(let el of arr) {
//         const temp = el.split(',');
//         map.set(parseInt(temp[0]), temp[1]);
//     }

//     return map;
// }