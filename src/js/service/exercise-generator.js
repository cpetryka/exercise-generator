import * as content from "../modules/content";
import * as utils from "../modules/utils";

class ExerciseGenerator {
    #data;
    #chosenSet;

    constructor() {
        // Get all the data from specified files
        this.#data = utils.createJsonObject([
            'tenses',
            'passive-voice',
            'reported-speech',
            'conditionals',
            'unreal-past',
            'relative-clauses',
            'verbs',
            'inversion'
        ]);

        // Set default value
        this.#chosenSet = [];
    }

    setChosenSet = newChosenSet => {
        if(!(Array.isArray(newChosenSet) || newChosenSet.length === 0)) {
            throw new TypeError("Passed value must be an array.");
        }

        this.#chosenSet = newChosenSet;
    }

    addElementToChosenSet = newElem => {
        if(!(typeof newElem === 'object' && !Array.isArray(newElem) && newElem !== null)) {
            throw TypeError("Passed value must be an object.");
        }

        this.#chosenSet.push(newElem);
    }

    clearChosenSet = () => {
        this.#chosenSet = [];
        content.refreshGeneratedSet();
    }

    saveChosenSet = () => {
        if(this.#chosenSet.length) {
            const str = JSON.stringify(this.#chosenSet, null, 4);
            let blob = new Blob([str], {type: "text/plain"});
            saveAs(blob, "chosen-exercises.json");
        }
    }
}