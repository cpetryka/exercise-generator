import * as utils from './utils';
import * as data from './data';
import * as pdfs from './pdfs';
import * as operations from './operations';
import * as content from './content';

export const createButton = (style, id, text, eventListener) => {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', `btn btn-${style} btn-sm `);
    button.setAttribute('id', id);
    button.innerText = text;
    button.addEventListener('click', eventListener);
    
    return button;
}

export const createDropdown = (style, id, text, arr) => {
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

export const generateButtons = () => {
    const fragment = document.createDocumentFragment();
    // fragment.setAttribute('id', 'buttons-container');

    // Deleting all exercises
    fragment.appendChild(createButton('secondary', 'delete-all-exercises', 'Clear', operations.deleteAllChosenExercises));

    // Adding features to the set
    let dropdown = createDropdown('secondary', 'dropdownMenuButton', 'Features ', ['add-title', 'add-heading', 'add-separator']);
    fragment.appendChild(dropdown);

    fragment.querySelector('#add-title').addEventListener('click', () => {
        const text = prompt('Enter the title: ');

        data.addToChosenSet({
            type: "title", 
            content: text 
        });

        content.refreshGeneratedSet();
    });

    fragment.querySelector('#add-heading').addEventListener('click', () => {
        const text = prompt('Enter the heading: ');

        data.addToChosenSet({
            type: "heading", 
            content: text 
        });

        content.refreshGeneratedSet();
    });

    fragment.querySelector('#add-separator').addEventListener('click', () => {
        data.addToChosenSet({ type: "separator" });
        content.refreshGeneratedSet();
    });

    // Saving chosen exercises
    fragment.appendChild(createButton('primary', 'save-chosen-exercises', 'Save the set', operations.saveChosenExercises));

    // Generating a pdf
    fragment.appendChild(createButton('primary', 'generate-pdf', 'Generate a pdf', pdfs.generatePDF));

    // Generating answers
    fragment.appendChild(createButton('primary', 'generate-answers', 'Generate answers', pdfs.generateAnswersPDF));

    return fragment;
}