import * as utils from './utils';

export const units = [
    'tenses',
    'passive-voice',
    'reported-speech',
    'conditionals',
    'unreal-past',
    'relative-clauses',
    'verbs',
    'inversion'
];

export const data = utils.createJsonObject(units);

export let chosenSet = [];

// Additional functions to edit chosenSet
export const editChosenSet = (newChosenSet) => {
    chosenSet = newChosenSet;
}

export const addToChosenSet = (newElem) => {
    chosenSet.push(newElem);
}