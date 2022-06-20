import 'jquery';
import { Modal } from 'bootstrap';
import '@fortawesome/fontawesome-free/js/all';
import { saveAs } from 'file-saver';

import '../css/style.scss';

const data = require('./../data/data.json');

// Array.from(document.querySelectorAll('.modal'))
//     .forEach(modalNode => new Modal(modalNode));


/**************************** CREATING EXERCISE PRESENTATION ****************************/
const convertStringToTitle = str => {
    str = str.replace(/-/g, ' ');
    str = str.charAt(0).toUpperCase() + str.slice(1);

    return str;
}

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
        heading.innerText = convertStringToTitle(data[i]["unit"]);
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
            button.innerText = convertStringToTitle(data[i]["subsections"][j]["subsectionName"]);

            itemHeading.appendChild(button);
            accordionItem.appendChild(itemHeading);

            let accordionCollapse = document.createElement('div');
            accordionCollapse.setAttribute('id', `${data[i]["unit"]}-collapse${j + 1}`);
            accordionCollapse.setAttribute('class', 'accordion-collapse collapse');
            accordionCollapse.setAttribute('aria-labelledby', `${data[i]["unit"]}-heading${j + 1}`);
            accordionCollapse.setAttribute('data-bs-parent', `#accordion-${data[i]["unit"]}`);
            
            let accordionBody = document.createElement('div');
            accordionBody.setAttribute('class', 'accordion-body');

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

document.querySelector('#exercises-presentation').appendChild(generateContent(data));

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
let exerciseIds = [];
let features = new Map();

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

    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    
    if(exerciseIds.length > 0) {
        gs.appendChild(generateSet(exerciseIds));
        gs.appendChild(generateButtons());
    }
}

const removeExerciseFromGeneratedSet = (arr, id) => {
    arr.splice(arr.indexOf(id), 1);

    refreshGeneratedSet();
}

const generateSet = (gs) => {
    const fragment = document.createDocumentFragment();

    for(let i = 0; i < gs.length; ++i) {
        const temp = convertIdToExercise(data, i + 1, gs[i]);
        temp.children[0].firstChild.addEventListener('dblclick', () => {
            const id = temp.getAttribute('id');
            removeExerciseFromGeneratedSet(gs, id);
        });

        fragment.appendChild(temp);

        if(features.has(i)) {
            const separator = document.createElement('div');
            separator.setAttribute('class', 'separator');
            // separator.innerText = 'Homework';
            separator.addEventListener('dblclick', () => {
                features.delete(i);
                refreshGeneratedSet();
            });
            fragment.appendChild(separator);
        }
    }

    return fragment;
}

const temp = document.querySelectorAll('.exercise-heading span');
temp.forEach(exercise => {
    exercise.addEventListener('click', () => {
        const id = exercise.parentElement.parentElement.getAttribute('id');
        exerciseIds.push(id);
        refreshGeneratedSet();
    });
});

/**************************** DELETING ALL CHOSEN EXERCISES ****************************/
const deleteAllChosenExercises = () => {
    exerciseIds = [];
    features.clear();
    refreshGeneratedSet();
}


/**************************** SAVING THE SET ****************************/
const saveChosenExercises = () => {
    let blob = new Blob([exerciseIds.join(';')], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "chosen-exercises.txt");
}

/**************************** GENERATING A PDF AND ANSWERS ****************************/
HTMLElement.prototype.printIt = printIt;

function printIt(title) {
    var myframe = document.createElement('iframe');
    myframe.domain = document.domain;
    myframe.style.position = "absolute";
    myframe.style.top = "-10000px";
    document.body.appendChild(myframe);

    if(title !== undefined && title.length) {
        myframe.contentDocument.write(`<h1>${title}</h1>`);
    }

    myframe.contentDocument.write(this.innerHTML);
    myframe.contentDocument.write('<style>@import"https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,700;1,400&display=swap";body{font-size:13.5px;font-family:"Barlow",sans-serif}*,::after,::before{box-sizing:border-box}h1{text-align:center}.separator{margin-top:18px;border-bottom:1px dashed rgba(0, 0, 0, 0.8);text-align:center;font-weight:bold;font-size:18px;}.exercise-heading{margin:0;margin-top:12px;font-size:24px}.exercise-heading span{cursor:pointer}p{padding:0;margin:0}ol{margin:0;margin-top:5px;counter-reset:list}ol li{list-style:none;position:relative}ol li::before{content:counter(list) ")";counter-increment:list;left:-40px;padding-right:10px;position:absolute;text-align:right;width:40px}</style>');

    setTimeout(function () {
        myframe.focus();
        myframe.contentWindow.print();
        myframe.parentNode.removeChild(myframe); // remove frame
    }, 3000); // wait for images to load inside iframe

    window.focus();
}

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

    for(let id of exerciseIds) {
        const exercise = findExercise(data, id);

        if(exercise.answers !== undefined) {
            temp.appendChild(generateAnswer(exercise, exerciseIds.indexOf(id) + 1));
        }
    }

    return temp;
}

const generatePDF = () => {
    const temp = document.createElement('div');
    temp.appendChild(generateSet(exerciseIds));
    
    temp.printIt(prompt('Enter the title: '));
}

const generateAnswersPDF = () => {
    generateAnswers().printIt("Answer key");
}

/**************************** GENERATING BUTTONS ****************************/
const createButton = (style, id, text, eventListener) => {
    let temp = document.createElement('button');
    temp.setAttribute('type', 'button');
    temp.setAttribute('class', `btn btn-${style}`);
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
    button.setAttribute('class', `btn btn-${style} dropdown-toggle`);
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
        a.innerText = convertStringToTitle(el);
        li.appendChild(a);
        ul.appendChild(li);
    }

    dropdown.appendChild(ul);

    return dropdown;
}

const generateButtons = () => {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.setAttribute('id', 'buttons-container');

    // Deleting all exercises
    buttonsContainer.appendChild(createButton('secondary', 'delete-all-exercises', 'Clear', deleteAllChosenExercises));

    // Adding features to the set
    let dropdown = createDropdown('secondary', 'dropdownMenuButton', 'Features ', ['add-heading', 'add-separator']);
    buttonsContainer.appendChild(dropdown);

    buttonsContainer.querySelector('#add-separator').addEventListener('click', () => {
        features.set(exerciseIds.length - 1, '-');
        refreshGeneratedSet();
    });

    // Saving chosen exercises
    buttonsContainer.appendChild(createButton('primary', 'save-chosen-exercises', 'Save the set', saveChosenExercises));

    // Generating a pdf
    buttonsContainer.appendChild(createButton('primary', 'generate-pdf', 'Generate a pdf', generatePDF));

    // Generating answers
    buttonsContainer.appendChild(createButton('primary', 'generate-answers', 'Generate answers', generateAnswersPDF));

    return buttonsContainer;
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
            exerciseIds = e.target.result.split(';');
            refreshGeneratedSet();
        }
    }

    modal.hide();
});