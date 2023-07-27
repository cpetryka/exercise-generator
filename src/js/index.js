/**************************** IMPORTS ****************************/
import 'jquery';
import { Modal } from 'bootstrap';
import '@fortawesome/fontawesome-free/js/all';
import { saveAs } from 'file-saver';
import Sortable from 'sortablejs'; // https://github.com/SortableJS/Sortable

import * as utils from './modules/utils';
import * as content from './modules/content';
import * as data from './modules/data';
import * as htmlGenerator from './generator/html-generator';

import '../css/style.scss';
import ButtonsGenerator from "./generator/buttons-generator";

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
                type: 'theory',
                src: imgSrc
            });

            content.refreshGeneratedSet();
        });
    });

    // Adds buttons to the website
    document.querySelector('#buttons-container').appendChild(ButtonsGenerator.generateButtons());
    
    // Makes chosen exercises sortable
    // If it's not a tablet and it's not a mobile phone, make these exercises sortable
    const ua = navigator.userAgent;

    if(!/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) && !/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        new Sortable(document.querySelector('#generated-set'), {
            animation: 150,
            filter: '.ignore-element',
            onEnd: function (evt) {
                utils.changeElementPosition(data.chosenSet, evt.oldIndex, evt.newIndex);
                content.refreshGeneratedSet();
            },
        });
    }

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

    // Support for small devices
    document.querySelector('#change-view').addEventListener('click', () => {
        const exercisPresentation = document.querySelector('#exercises-presentation');
        const chosenSet = document.querySelector('#generated-set-container');

        if(chosenSet.style.display === 'none') {
            chosenSet.style.display = 'block';
            exercisPresentation.style.display = 'none';
        }
        else {
            exercisPresentation.style.display = 'block';
            chosenSet.style.display = 'none';
        }
    });

    window.addEventListener('resize', () => {
        if(window.innerWidth > 768) {
            const exercisPresentation = document.querySelector('#exercises-presentation');
            const chosenSet = document.querySelector('#generated-set-container');

            exercisPresentation.style.display = 'block';
            chosenSet.style.display = 'block';
        }
    });
}

initializeWebsite();