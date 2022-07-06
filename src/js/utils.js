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

const insertAtPosition = (arr, pos, elem) => {
    if(pos < 0 || pos > arr.length) {
        throw new Error("Incorrect position value.");
    }

    // Shift all the elements from the last index to pos by 1 position to right
    for(let i = arr.length; i > pos; i--) {
        arr[i] = arr[i-1];
    }

    // Insert element at the given position
    arr[pos] = elem;
}