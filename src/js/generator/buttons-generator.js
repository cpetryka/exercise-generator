import * as utils from "../modules/utils";
import * as content from "../modules/content";
import * as pdfs from "../modules/pdfs";
import {exerciseGenerator} from "../service/exercise-generator";

class ButtonsGenerator {
    static createButton = (style, id, text, eventListener) => {
        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', `btn btn-${style} btn-sm `);
        button.setAttribute('id', id);
        button.innerText = text;
        button.addEventListener('click', eventListener);

        return button;
    }

    static createDropdown = (style, id, text, menuItemsIds) => {
        let dropdown = document.createElement('div');
        dropdown.setAttribute('class', 'dropdown');
        dropdown.style.display = 'inline-block';

        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', `btn btn-${style} btn-sm  dropdown-toggle`);
        button.setAttribute('id', id);
        button.setAttribute('data-bs-toggle', 'dropdown');
        button.setAttribute('aria-expanded', 'false');
        button.innerText = text;
        dropdown.appendChild(button);

        let menuItemsList = document.createElement('ul');
        menuItemsList.setAttribute('class', 'dropdown-menu dropdown-menu-dark');
        menuItemsList.setAttribute('aria-labelledby', id);

        for(let menuItemId of menuItemsIds) {
            let menuItemLink = document.createElement('a');
            menuItemLink.setAttribute('class', 'dropdown-item');
            menuItemLink.setAttribute('id', menuItemId);
            menuItemLink.innerText = utils.convertStringToTitle(menuItemId);

            let menuItem = document.createElement('li');
            menuItem.appendChild(menuItemLink);

            menuItemsList.appendChild(menuItem);
        }

        dropdown.appendChild(menuItemsList);

        return dropdown;
    }

    static generateButtons = () => {
        const buttonsFragment = document.createDocumentFragment();

        // Delete all exercises button
        buttonsFragment.appendChild(ButtonsGenerator.createButton(
            'secondary',
            'delete-all-exercises',
            'Clear',
            exerciseGenerator.clearChosenSet
        ));

        // Features button
        buttonsFragment.appendChild(ButtonsGenerator.createDropdown(
            'secondary',
            'dropdownMenuButton',
            'Features ',
            ['add-title', 'add-heading', 'add-note', 'add-separator']
        ));

        buttonsFragment.querySelector('#add-title').addEventListener('click', () => {
            const text = prompt('Enter the title: ');

            exerciseGenerator.addElementToChosenSet({
                type: "title",
                content: text
            });

            content.refreshGeneratedSet();
        });

        buttonsFragment.querySelector('#add-heading').addEventListener('click', () => {
            const text = prompt('Enter the heading: ');

            exerciseGenerator.addElementToChosenSet({
                type: "heading",
                content: text
            });

            content.refreshGeneratedSet();
        });

        buttonsFragment.querySelector('#add-note').addEventListener('click', () => {
            const text = prompt('Enter the note: ');

            exerciseGenerator.addElementToChosenSet({
                type: "note",
                content: text
            });

            content.refreshGeneratedSet();
        });

        buttonsFragment.querySelector('#add-separator').addEventListener('click', () => {
            exerciseGenerator.addElementToChosenSet({ type: "separator" });
            content.refreshGeneratedSet();
        });

        // Save chosen exercises button
        buttonsFragment.appendChild(ButtonsGenerator.createButton(
            'primary',
            'save-chosen-exercises',
            'Save the set',
            exerciseGenerator.saveChosenSet
        ));

        // Generate pdf button
        buttonsFragment.appendChild(ButtonsGenerator.createButton(
            'primary',
            'generate-pdf',
            'Generate a pdf',
            pdfs.generatePDF
        ));

        // Generate answers button
        buttonsFragment.appendChild(ButtonsGenerator.createButton(
            'primary',
            'generate-answers',
            'Generate answers',
            pdfs.generateAnswersPDF
        ));

        return buttonsFragment;
    }
}

export default ButtonsGenerator;