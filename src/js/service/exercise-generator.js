import * as utils from "../modules/utils";
import * as content from "../modules/content";

class ExerciseGenerator {
    // ----------------------------------- FIELDS -----------------------------------
    #data;
    #chosenSet;

    // ----------------------------------- CONSTRUCTORS -----------------------------------
    constructor() {
        // Get all the data from specified files
        this.#data = utils.createJsonObject([
            'tenses',
            'passive-voice',
            'conditionals',
            'unreal-past',
            'reported-speech',
            'relative-clauses',
            'verbs',
            'inversion',
            'word-formation'
        ]);

        // Set default value
        this.#chosenSet = [];
    }

    // ----------------------------------- GETTERS -----------------------------------
    get data() {
        return this.#data;
    }

    get chosenSet() {
        return this.#chosenSet;
    }

    // ----------------------------------- METHODS TO MANAGE THE CHOSENSET -----------------------------------
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

export const exerciseGenerator = new ExerciseGenerator();