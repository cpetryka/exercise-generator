import * as utils from './utils';
import HtmlGenerator from '../generator/html-generator';
import HtmlContentGenerator from "../generator/html-content-generator";
import {exerciseGenerator} from "../service/exercise-generator";

export const generateExercise = (exerciseNumber, exerciseId, data) => {
    let wrapper = HtmlGenerator.generateHtmlElement('div', { id: exerciseId, class: 'exercise', uuid: data.uuid });

    // Heading
    let heading = HtmlGenerator.generateHtmlElement('h4', { class: 'exercise-heading' });
    heading.appendChild(
        HtmlGenerator.generateHtmlElement('span', { class: 'exercise-number', text: `Exercise ${exerciseNumber}` })
    );
    wrapper.appendChild(heading);

    // Task
    wrapper.appendChild(HtmlGenerator.generateHtmlElement('p', { text: data.task }));

    // Additional content
    if(data.content) {
        if(data.content.length === 1) {
            wrapper.appendChild(HtmlGenerator.generateHtmlElement('p', { text: data.content[0]}));
        }
        else if(data.content.length > 1) {
            let list = document.createElement('ol');
    
            for(let i = 0; i < data.content.length; ++i) {
                list.appendChild(HtmlGenerator.generateHtmlElement('li', { text: data.content[i] }));
            }
    
            wrapper.appendChild(list);
        }
    }

    return wrapper;
}

export const generateContent = () => {
    let fragment = document.createDocumentFragment();

    for(let i = 0; i < exerciseGenerator.data.length; ++i) {
        let unitContainer = HtmlGenerator.generateHtmlElement('div', { class: 'unit' });

        // Heading
        unitContainer.appendChild(
            HtmlGenerator.generateHtmlElement('h3', { class: 'unit-heading', text: utils.convertStringToTitle(exerciseGenerator.data[i]["unit"])})
        );

        // Accordion
        let accordion = HtmlGenerator.generateHtmlElement('div', { id: `accordion-${exerciseGenerator.data[i]["unit"]}`, class: 'accordion accordion-flush' });
        unitContainer.appendChild(accordion);

        // Adding subsections
        for(let j = 0; j < exerciseGenerator.data[i]["subsections"].length; ++j) {
            let accordionItem = HtmlGenerator.generateHtmlElement('div', { class: 'accordion-item' });

            let itemHeading = HtmlGenerator.generateHtmlElement('h2', { id: `${exerciseGenerator.data[i]["unit"]}-heading${j + 1}`, class: 'accordion-header' });

            let button = HtmlGenerator.generateHtmlElement('button', { 
                class: 'accordion-button collapsed', 
                type: 'button', 
                'data-bs-toggle': 'collapse', 
                'data-bs-target': `#${exerciseGenerator.data[i]["unit"]}-collapse${j + 1}`, 
                'aria-expanded': 'false', 
                'aria-controls': `${exerciseGenerator.data[i]["unit"]}-collapse${j + 1}`,
                text: utils.convertStringToTitle(exerciseGenerator.data[i]["subsections"][j]["subsectionName"])
            });

            itemHeading.appendChild(button);
            accordionItem.appendChild(itemHeading);

            let accordionCollapse = HtmlGenerator.generateHtmlElement('div', {
                id: `${exerciseGenerator.data[i]["unit"]}-collapse${j + 1}`,
                class: 'accordion-collapse collapse',
                'aria-labelledby': `${exerciseGenerator.data[i]["unit"]}-heading${j + 1}`,
                'data-bs-parent': `#accordion-${exerciseGenerator.data[i]["unit"]}`
            });
            
            let accordionBody = HtmlGenerator.generateHtmlElement('div', { class: 'accordion-body' });

            let counter = 1;

            for(let k = 0; k < exerciseGenerator.data[i]["subsections"][j]["subsectionContent"].length; ++k) {
                const contentItem = exerciseGenerator.data[i]["subsections"][j]["subsectionContent"][k];
                if(contentItem['type'] === 'exercise') {
                    accordionBody.appendChild(generateExercise(counter++, utils.generateExercisesId(exerciseGenerator.data[i]["unit"], exerciseGenerator.data[i]["subsections"][j]["subsectionName"], k + 1), contentItem));
                }
                else if(contentItem['type'] === 'theory') {
                    let theory = HtmlGenerator.generateHtmlElement('h4', { class: 'theory-presentation-heading', 'data-src': `${exerciseGenerator.data[i]["unit"]}/${contentItem["src"]}` });
                    theory.appendChild(
                        HtmlGenerator.generateHtmlElement('span', { class: 'exercise-number', text: contentItem['heading'] })
                    );
                    accordionBody.appendChild(theory);
                }
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

export const convertIdToExercise = (num, id) => {
    return generateExercise(num, id, findExercise(id));
}

export const countExercises = () => {
    let counter = 0;

    for (let el of exerciseGenerator.chosenSet) {
        if(el.type === 'exercise') ++counter;
    }

    return counter;
}

export const findExercise = (id) => {
    const unitsMap = utils.createUnitsMap();
    const subsectionsMaps = utils.createSubsectionsMaps();

    const unit = id.slice(0, id.indexOf('_'));
    const subsection = id.slice(id.indexOf('_') + 1, id.lastIndexOf('_'));
    const exNum = parseInt(id.slice(id.lastIndexOf('_') + 1));

    return exerciseGenerator.data[unitsMap.get(unit)]['subsections'][subsectionsMaps[unitsMap.get(unit)].get(subsection)]['subsectionContent'][exNum - 1];
}

export const convertUUIDToExercise = (num, id, uuid) => {
    return generateExercise(num, id, findExerciseByUUID(uuid));
}

export const findExerciseByUUID = (uuid) => {
    for(let i = 0; i < exerciseGenerator.data.length; ++i) {
        for(let j = 0; j < exerciseGenerator.data[i]["subsections"].length; ++j) {
            for(let k = 0; k < exerciseGenerator.data[i]["subsections"][j]["subsectionContent"].length; ++k) {
                if(exerciseGenerator.data[i]["subsections"][j]["subsectionContent"][k].uuid === uuid) {
                    return exerciseGenerator.data[i]["subsections"][j]["subsectionContent"][k];
                }
            }
        }
    }

    return null;
}

export const generateSet = () => {
    const fragment = document.createDocumentFragment();
    let counter = 1;

    for(let i = 0; i < exerciseGenerator.chosenSet.length; ++i) {
        let temp;

        switch(exerciseGenerator.chosenSet[i].type) {
            case 'exercise':
                if(exerciseGenerator.chosenSet[i].uuid) {
                    temp = convertUUIDToExercise(
                        counter++, 
                        exerciseGenerator.chosenSet[i].id, 
                        exerciseGenerator.chosenSet[i].uuid
                    );
                }
                else {
                    temp = convertIdToExercise(counter++, exerciseGenerator.chosenSet[i].id);
                }

                break;
            case 'theory':
                temp = HtmlContentGenerator.createTheoryImage(exerciseGenerator.chosenSet[i].src);
                break;
            case 'title':
                temp = HtmlContentGenerator.createTitle(exerciseGenerator.chosenSet[i].content);
                break;
            case 'heading':
                temp = HtmlContentGenerator.createHeading(exerciseGenerator.chosenSet[i].content);
                break;
            case 'note':
                temp = HtmlContentGenerator.createNote(exerciseGenerator.chosenSet[i].content);
                break;
            default: // when exerciseGenerator.chosenSet[i].type === 'separator'
                temp = HtmlContentGenerator.createSeparator();
                break;
        }

        temp.addEventListener('dblclick', () => {
            exerciseGenerator.chosenSet.splice(i, 1);
            refreshGeneratedSet();

            const generatedSet = document.querySelector('#genetated-set');
        });

        fragment.appendChild(temp);
    }

    return fragment;
}

export const generateAnswer = (exercise, exerciseNumber) => {
    const wrapper = HtmlGenerator.generateHtmlElement('div', { class: 'answers' });

    // Heading
    let heading = HtmlGenerator.generateHtmlElement('h4', { class: 'exercise-heading' });
    heading.appendChild(
        HtmlGenerator.generateHtmlElement('span', { class: 'exercise-number', text: `Exercise ${exerciseNumber}` })
    );
    wrapper.appendChild(heading);

    // Content
    if(exercise.answers.length > 1) {
        let list = document.createElement('ol');

        for(let oneAnswer of exercise.answers) {
            list.appendChild(HtmlGenerator.generateHtmlElement('li', { text: oneAnswer }));
        }

        wrapper.appendChild(list);
    }
    else {
        wrapper.appendChild(HtmlGenerator.generateHtmlElement('p', { text: exercise.answers[0] }));
    }

    return wrapper;
}

export const generateAnswers = () => {
    const wrapper = HtmlGenerator.generateHtmlElement('div', { id: 'answers' });

    const generatedSet = document.querySelector('#generated-set-container');

    for(let obj of exerciseGenerator.chosenSet) {
        if(obj.type === 'exercise') {
            const exercise = findExercise(obj.id);

            if(exercise.answers !== undefined) {
                const exerciseHeading = generatedSet.querySelector(`#${obj.id}`).firstChild.firstChild.innerText;
                const exerciseNumber = parseInt(exerciseHeading.slice(exerciseHeading.indexOf(' ')));

                wrapper.appendChild(generateAnswer(exercise, exerciseNumber));
            }
        }
    }

    return wrapper;
}

export const refreshGeneratedSet = () => {
    const gs = document.querySelector('#generated-set');

    if(gs.children.length !== 0) {
        while (gs.firstChild) {
            gs.removeChild(gs.lastChild);
        }
    }
    
    if(exerciseGenerator.chosenSet.length > 0) {
        gs.appendChild(generateSet());
    }
    else {
        gs.appendChild(
            HtmlGenerator.generateHtmlElement('p', { class: 'initial-text ignore-element', text: 'This is the place for your exercises.' })
        );
    }
}