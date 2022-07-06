import 'jquery';
import { Modal } from 'bootstrap';
import '@fortawesome/fontawesome-free/js/all';
import { saveAs } from 'file-saver';
import * as utils from './utils.js';
import Sortable from 'sortablejs'; // https://github.com/SortableJS/Sortable

import '../css/style.scss';

const units = [
    'tenses',
    'passive-voice',
    'reported-speech',
    'conditionals',
    'unreal-past',
    'relative-clauses',
    'verbs',
    'inversion'
];

const createJsonObject = (units) => {
    const data = [];

    for(const unit of units) {
        data.push(require(`./../data/units/${unit}.json`));
    }

    return data;
}

const data = createJsonObject(units);

/**************************** SINLGE EXERCISE ****************************/
const generateExercisesId = (unit, subsection, exerciseNumber) => {
    return `${unit}_${subsection}_${exerciseNumber}`
}

const generateExercise = (exerciseNumber, data, exerciseId) => {
    let elem = document.createElement('div');
    
    // Adding attributes to the exercise container
    elem.setAttribute('class', 'exercise');
    elem.setAttribute('id', exerciseId);

    // Creating content
    
    // Heading
    let heading = document.createElement('h4');
    heading.setAttribute('class', 'exercise-heading');

    let span = document.createElement('span');
    span.setAttribute('class', 'exercise-number');
    span.innerText = `Exercise ${exerciseNumber}`;

    heading.appendChild(span);
    elem.appendChild(heading);

    // Task
    let task = document.createElement('p');
    task.innerText = data.task;
    elem.appendChild(task);

    // Additional content
    if(data.content) {
        if(data.content.length === 1) {
            let p = document.createElement('p');
            p.innerText = data.content[0];
            elem.appendChild(p);
        }
        else if(data.content.length > 1) {
            let list = document.createElement('ol');
    
            for(let i = 0; i < data.content.length; ++i) {
                let listItem = document.createElement('li');
                listItem.innerText = data.content[i];
                list.appendChild(listItem);
            }
    
            elem.appendChild(list);
        }
    }

    return elem;
}

/**************************** GENERATING MAIN CONTENT ****************************/
const generateContent = (data) => {
    let fragment = document.createDocumentFragment();

    for(let i = 0; i < data.length; ++i) {
        let unitContainer = document.createElement('div');

        // Adding attributes to the unit container
        unitContainer.setAttribute('class', 'unit');

        // Creating content

        // Heading
        let heading = document.createElement('h3');
        heading.setAttribute('class', 'unit-heading');
        heading.innerText = utils.convertStringToTitle(data[i]["unit"]);
        unitContainer.appendChild(heading);

        // Accordion
        let accordion = document.createElement('div');
        accordion.setAttribute('class', 'accordion accordion-flush');
        accordion.setAttribute('id', `accordion-${data[i]["unit"]}`);
        unitContainer.appendChild(accordion);

        // Adding subsections
        for(let j = 0; j < data[i]["subsections"].length; ++j) {
            let accordionItem = document.createElement('div');
            accordionItem.setAttribute('class', 'accordion-item');

            let itemHeading = document.createElement('h2');
            itemHeading.setAttribute('class', 'accordion-header');
            itemHeading.setAttribute('id', `${data[i]["unit"]}-heading${j + 1}`);

            let button = document.createElement('button');
            button.setAttribute('class', 'accordion-button collapsed');
            button.setAttribute('type', 'button');
            button.setAttribute('data-bs-toggle', 'collapse');
            button.setAttribute('data-bs-target', `#${data[i]["unit"]}-collapse${j + 1}`);
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `${data[i]["unit"]}-collapse${j + 1}`);
            button.innerText = utils.convertStringToTitle(data[i]["subsections"][j]["subsectionName"]);

            itemHeading.appendChild(button);
            accordionItem.appendChild(itemHeading);

            let accordionCollapse = document.createElement('div');
            accordionCollapse.setAttribute('id', `${data[i]["unit"]}-collapse${j + 1}`);
            accordionCollapse.setAttribute('class', 'accordion-collapse collapse');
            accordionCollapse.setAttribute('aria-labelledby', `${data[i]["unit"]}-heading${j + 1}`);
            accordionCollapse.setAttribute('data-bs-parent', `#accordion-${data[i]["unit"]}`);
            
            let accordionBody = document.createElement('div');
            accordionBody.setAttribute('class', 'accordion-body');

            if(data[i]["subsections"][j]["theory"]) {
                let theory = document.createElement('h4');
                theory.setAttribute('class', 'theory-presentation-heading');

                let span = document.createElement('span');
                span.setAttribute('class', 'exercise-number');
                span.innerText = `Theory presentation`;
                theory.appendChild(span);

                theory.addEventListener('click', () => {
                    chosenSet.push({
                        type: 'image',
                        src: `${data[i]['unit']}/${data[i]["subsections"][j]["theory"]}`
                    });
                    refreshGeneratedSet();
                })

                accordionBody.appendChild(theory);
            }

            for(let k = 0; k < data[i]["subsections"][j]["exercises"].length; ++k) {
                accordionBody.appendChild(generateExercise(k + 1, data[i]["subsections"][j]["exercises"][k], generateExercisesId(data[i]["unit"], data[i]["subsections"][j]["subsectionName"], k + 1)));
            }

            accordionCollapse.appendChild(accordionBody);
            accordionItem.appendChild(accordionCollapse);
            accordion.appendChild(accordionItem);

            unitContainer.appendChild(accordion);
            fragment.appendChild(unitContainer);
        }
    }

    return fragment;
}

/**************************** UNITS AND EXERCISES MAPS ****************************/
const createUnitsMap = (data) => {
    const map = new Map();
    let i = 0;

    for(const oneUnit of data) {
        map.set(oneUnit["unit"], i++);
    }

    return map;
}

const createSubsectionsMaps = (data) => {
    const arr = [];

    for(const oneUnit of data) {
        let temp = new Map();
        let i = 0;

        for(const subsection of oneUnit["subsections"]) {
            temp.set(subsection["subsectionName"], i++)
        }

        arr.push(temp);
    }

    return arr;
}

const unitsMap = createUnitsMap(data);
const subsectionsMaps = createSubsectionsMaps(data);

/**************************** ADDING EXERCISES TO THE SET ****************************/
let chosenSet = [];

const findExercise = (data, id) => {
    const unit = id.slice(0, id.indexOf('_'));
    const subsection = id.slice(id.indexOf('_') + 1, id.lastIndexOf('_'));
    const exNum = parseInt(id.slice(id.lastIndexOf('_') + 1));

    return data[unitsMap.get(unit)]['subsections'][subsectionsMaps[unitsMap.get(unit)].get(subsection)]['exercises'][exNum - 1];
}

const convertIdToExercise = (data, num, id) => {
    return generateExercise(num, findExercise(data, id), id);
}

const refreshGeneratedSet = () => {
    const gs = document.querySelector('#generated-set');

    if(gs.children.length !== 0) {
        while (gs.firstChild) {
            gs.removeChild(gs.lastChild);
        }
    }
    
    if(chosenSet.length > 0) {
        gs.appendChild(generateSet(chosenSet));
    }
    else {
        const p = document.createElement('p');
        p.setAttribute('class', 'initial-text ignore-element');
        p.innerText = 'This is the place for your exercises.';
        gs.appendChild(p);
    }
}

const generateSet = (arr) => {
    const fragment = document.createDocumentFragment();
    let counter = 1;

    for(let i = 0; i < arr.length; ++i) {
        let temp;

        if(arr[i].type === 'exercise') {
            temp = convertIdToExercise(data, counter++, arr[i].id);
        }
        else if(arr[i].type === 'image') {
            temp = document.createElement('img');
            temp.setAttribute('src', `assets/${arr[i].src}`);
            temp.setAttribute('alt', 'Theory presentation');
            temp.setAttribute('class', 'img-fluid theory-presentation-img');
        }
        else if(arr[i].type === 'title') {
            temp = document.createElement('h2');
            temp.setAttribute('class', 'main-title');
            temp.innerText = arr[i].content;
        }
        else if(arr[i].type === 'heading') {
            temp = document.createElement('h3');
            temp.setAttribute('class', 'additional-heading');
            temp.innerText = arr[i].content;
        }
        else { // when arr[i].type === 'separator'
            temp = document.createElement('div');
            temp.setAttribute('class', 'separator');
        }

        temp.addEventListener('dblclick', () => {
            chosenSet.splice(i, 1);
            refreshGeneratedSet();
        });

        fragment.appendChild(temp);
    }

    return fragment;
}

/**************************** DELETING ALL CHOSEN EXERCISES ****************************/
const deleteAllChosenExercises = () => {
    chosenSet = [];
    refreshGeneratedSet();
}

/**************************** SAVING THE SET ****************************/

const saveChosenExercises = () => {
    if(chosenSet.length) {
        const str = JSON.stringify(chosenSet, null, 4);
        let blob = new Blob([str], {type: "text/plain"});
        saveAs(blob, "chosen-exercises.json");
    }
}

/**************************** GENERATING A PDF AND ANSWERS ****************************/
const generateAnswer = (exercise, exerciseNumber) => {
    const temp = document.createElement('div');
    temp.setAttribute('id', "answer");

    // Heading
    let heading = document.createElement('h4');
    heading.setAttribute('class', 'exercise-heading');

    let span = document.createElement('span');
    span.setAttribute('class', 'exercise-number');
    span.innerText = `Exercise ${exerciseNumber}`;

    heading.appendChild(span);
    temp.appendChild(heading);

    // Content
    if(exercise.answers.length > 1) {
        let list = document.createElement('ol');

        for(let oneAnswer of exercise.answers) {
            let listItem = document.createElement('li');
            listItem.innerText = oneAnswer;
            list.appendChild(listItem);
        }

        temp.appendChild(list);
    }
    else {
        const p = document.createElement('p');
        p.innerText = exercise.answers[0];
        temp.appendChild(p);
    }

    return temp;
}

const generateAnswers = () => {
    const temp = document.createElement('div');
    temp.setAttribute('id', "answers");

    const generatedSet = document.querySelector('#generated-set-container');

    for(let obj of chosenSet) {
        if(obj.type === 'exercise') {
            const exercise = findExercise(data, obj.id);

            if(exercise.answers !== undefined) {

                const exerciseHeading = generatedSet.querySelector(`#${obj.id}`).firstChild.firstChild.innerText;
                const exerciseNumber = parseInt(exerciseHeading.slice(exerciseHeading.indexOf(' ')));

                temp.appendChild(generateAnswer(exercise, exerciseNumber));
            }
        }
    }

    return temp;
}

const generatePDF = () => {
    const temp = document.createElement('div');
    temp.appendChild(generateSet(chosenSet));
    
    temp.printIt('');
}

const generateAnswersPDF = () => {
    generateAnswers().printIt("Answer key");
}

/**************************** GENERATING BUTTONS ****************************/
const createButton = (style, id, text, eventListener) => {
    let temp = document.createElement('button');
    temp.setAttribute('type', 'button');
    temp.setAttribute('class', `btn btn-${style} btn-sm `);
    temp.setAttribute('id', id);
    temp.innerText = text;
    temp.addEventListener('click', eventListener);
    
    return temp;
}

const createDropdown = (style, id, text, arr) => {
    let dropdown = document.createElement('div');
    dropdown.setAttribute('class', 'dropdown');
    dropdown.style.display = 'inline-block';

    let button = document.createElement('button');
    button.setAttribute('class', `btn btn-${style} btn-sm  dropdown-toggle`);
    button.setAttribute('type', 'button');
    button.setAttribute('id', id);
    button.setAttribute('data-bs-toggle', 'dropdown');
    button.setAttribute('aria-expanded', 'false');
    button.innerText = text;
    dropdown.appendChild(button);

    let ul = document.createElement('ul');
    ul.setAttribute('class', 'dropdown-menu dropdown-menu-dark');
    ul.setAttribute('aria-labelledby', id);

    for(let el of arr) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute('class', 'dropdown-item');
        a.setAttribute('id', el);
        a.innerText = utils.convertStringToTitle(el);
        li.appendChild(a);
        ul.appendChild(li);
    }

    dropdown.appendChild(ul);

    return dropdown;
}

const generateButtons = () => {
    const fragment = document.createDocumentFragment();
    // fragment.setAttribute('id', 'buttons-container');

    // Deleting all exercises
    fragment.appendChild(createButton('secondary', 'delete-all-exercises', 'Clear', deleteAllChosenExercises));

    // Adding features to the set
    let dropdown = createDropdown('secondary', 'dropdownMenuButton', 'Features ', ['add-title', 'add-heading', 'add-separator']);
    fragment.appendChild(dropdown);

    fragment.querySelector('#add-title').addEventListener('click', () => {
        const text = prompt('Enter the title: ');

        chosenSet.push({
            type: "title", 
            content: text 
        });

        refreshGeneratedSet();
    });

    fragment.querySelector('#add-heading').addEventListener('click', () => {
        const text = prompt('Enter the heading: ');

        chosenSet.push({
            type: "heading", 
            content: text 
        });

        refreshGeneratedSet();
    });

    fragment.querySelector('#add-separator').addEventListener('click', () => {
        chosenSet.push({ type: "separator" });
        refreshGeneratedSet();
    });

    // Saving chosen exercises
    fragment.appendChild(createButton('primary', 'save-chosen-exercises', 'Save the set', saveChosenExercises));

    // Generating a pdf
    fragment.appendChild(createButton('primary', 'generate-pdf', 'Generate a pdf', generatePDF));

    // Generating answers
    fragment.appendChild(createButton('primary', 'generate-answers', 'Generate answers', generateAnswersPDF));

    return fragment;
}

/**************************** UPLOADING A FILE ****************************/
const modal = new Modal(document.querySelector('#uploadModal'));

const submitFile = document.querySelector('#submit-file');
submitFile.removeEventListener('submit', SubmitEvent);

submitFile.addEventListener('click', () => {
    const file = document.querySelector('#file-selector');

    if(file.files.length) {
        let reader = new FileReader();
        reader.readAsBinaryString(file.files[0]);

        reader.onload = e => {
            chosenSet = JSON.parse(e.target.result);
            refreshGeneratedSet();
        }
    }

    modal.hide();
});

const changeElementPosition = (arr, oldIdx, newIdx, elem) => {
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

const initializeWebsite = () => {
    // Generated content to #exercise-presentation
    document.querySelector('#exercises-presentation').appendChild(generateContent(data));

    // The following code makes these exercises addable to #generated-set
    const temp = document.querySelectorAll('.exercise-heading span');
    temp.forEach(exercise => {
        exercise.addEventListener('click', () => {
            const id = exercise.parentElement.parentElement.getAttribute('id');

            chosenSet.push({
                type: "exercise",
                id: id
            });


            refreshGeneratedSet();
        });
    });

    // Adds buttons to the website
    document.querySelector('#buttons-container').appendChild(generateButtons());
    
    // Makes chosen exercises sortable
    new Sortable(document.querySelector('#generated-set'), {
        animation: 150,
        filter: '.ignore-element',
        onEnd: function (evt) {
            changeElementPosition(chosenSet, evt.oldIndex, evt.newIndex);
            refreshGeneratedSet();
        },
    });
}

initializeWebsite();