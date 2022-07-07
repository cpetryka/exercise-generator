import * as content from './content';
import * as data from './data';

export const deleteAllChosenExercises = () => {
    data.editChosenSet([]);
    content.refreshGeneratedSet();
}

export const saveChosenExercises = () => {
    if(data.chosenSet.length) {
        const str = JSON.stringify(data.chosenSet, null, 4);
        let blob = new Blob([str], {type: "text/plain"});
        saveAs(blob, "chosen-exercises.json");
    }
}