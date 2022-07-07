/**************************** IMPORTS ****************************/
import 'jquery';
import { Modal } from 'bootstrap';
import '@fortawesome/fontawesome-free/js/all';
import { saveAs } from 'file-saver';
import Sortable from 'sortablejs'; // https://github.com/SortableJS/Sortable

import * as utils from './modules/utils';
import * as content from './modules/content';
import * as buttons from './modules/buttons';
import * as data from './modules/data';

import '../css/style.scss';

/**************************** MAIN PART ****************************/
const initializeWebsite = () => {
    // Generated content to #exercise-presentation
    document.querySelector('#exercises-presentation').appendChild(content.generateContent());

    // The following code makes these exercises addable to #generated-set
    const temp = document.querySelectorAll('.exercise-heading span');
    temp.forEach(exercise => {
        exercise.addEventListener('click', () => {
            const id = exercise.parentElement.parentElement.getAttribute('id');

            data.addToChosenSet({
                type: "exercise",
                id: id
            });

            content.refreshGeneratedSet();
        });
    });

    // The following code makes theory presentations addable to #generated-set
    const temp2 = document.querySelectorAll('.theory-presentation-heading span');
    temp2.forEach(x => {
        x.addEventListener('click', () => {
            const imgSrc = x.parentElement.getAttribute('data-src');

            data.addToChosenSet({
                type: 'image',
                src: imgSrc
            });

            content.refreshGeneratedSet();
        });
    });

    // Adds buttons to the website
    document.querySelector('#buttons-container').appendChild(buttons.generateButtons());
    
    // Makes chosen exercises sortable
    new Sortable(document.querySelector('#generated-set'), {
        animation: 150,
        filter: '.ignore-element',
        onEnd: function (evt) {
            utils.changeElementPosition(data.chosenSet, evt.oldIndex, evt.newIndex);
            content.refreshGeneratedSet();
        },
    });

    // Allows apploading a file
    const modal = new Modal(document.querySelector('#uploadModal'));

    const submitFile = document.querySelector('#submit-file');
    submitFile.removeEventListener('submit', SubmitEvent);

    submitFile.addEventListener('click', () => {
        const file = document.querySelector('#file-selector');

        if(file.files.length) {
            let reader = new FileReader();
            reader.readAsBinaryString(file.files[0]);

            reader.onload = e => {
                data.editChosenSet(JSON.parse(e.target.result));
                content.refreshGeneratedSet();
            }
        }

        modal.hide();
    });
}

initializeWebsite();