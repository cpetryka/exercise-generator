import {exerciseGenerator} from "../service/exercise-generator";

export const convertStringToTitle = str => {
    str = str.replace(/-/g, ' ');
    str = str.charAt(0).toUpperCase() + str.slice(1);

    return str;
}

// TODO Moved to the Exercise class
export const generateExercisesId = (unit, subsection, exerciseNumber) => {
    return `${unit}_${subsection}_${exerciseNumber}`
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

export function createJsonObject(data) {
    const arr = [];

    for(const x of data) {
        arr.push(require(`./../../data/${x}.json`));
    }

    return arr;
}

export const createUnitsMap = () => {
    const map = new Map();
    let i = 0;

    for(const oneUnit of exerciseGenerator.data) {
        map.set(oneUnit["unit"], i++);
    }

    return map;
}

export const createSubsectionsMaps = () => {
    const arr = [];

    for(const oneUnit of exerciseGenerator.data) {
        let temp = new Map();
        let i = 0;

        for(const subsection of oneUnit["subsections"]) {
            temp.set(subsection["subsectionName"], i++)
        }

        arr.push(temp);
    }

    return arr;
}

export const changeElementPosition = (arr, oldIdx, newIdx) => {
    const temp = arr[oldIdx];

    // Shift all the elements from the last index to pos by 1 position to right
    for(let i = arr.length; i > newIdx; i--) {
        arr[i] = arr[i-1];
    }

    // Insert element at the given position and remove from the previous position
    if(newIdx > oldIdx) {
        arr[newIdx + 1] = temp;
        arr.splice(oldIdx, 1);
    }
    else {
        arr[newIdx] = temp;
        arr.splice(oldIdx + 1, 1);
    }
}