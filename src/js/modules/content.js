import * as utils from './utils';
import * as data from './data';

export const generateExercise = (exerciseNumber, exerciseId, data) => {
    let wrapper = document.createElement('div');
    
    // Adding attributes to the exercise container
    wrapper.setAttribute('class', 'exercise');
    wrapper.setAttribute('id', exerciseId);

    // Creating content
    
    // Heading
    let heading = document.createElement('h4');
    heading.setAttribute('class', 'exercise-heading');

    let span = document.createElement('span');
    span.setAttribute('class', 'exercise-number');
    span.innerText = `Exercise ${exerciseNumber}`;

    heading.appendChild(span);
    wrapper.appendChild(heading);

    // Task
    let task = document.createElement('p');
    task.innerText = data.task;
    wrapper.appendChild(task);

    // Additional content
    if(data.content) {
        if(data.content.length === 1) {
            let p = document.createElement('p');
            p.innerText = data.content[0];
            wrapper.appendChild(p);
        }
        else if(data.content.length > 1) {
            let list = document.createElement('ol');
    
            for(let i = 0; i < data.content.length; ++i) {
                let listItem = document.createElement('li');
                listItem.innerText = data.content[i];
                list.appendChild(listItem);
            }
    
            wrapper.appendChild(list);
        }
    }

    return wrapper;
}

export const generateContent = () => {
    let fragment = document.createDocumentFragment();

    for(let i = 0; i < data.data.length; ++i) {
        let unitContainer = document.createElement('div');

        // Adding attributes to the unit container
        unitContainer.setAttribute('class', 'unit');

        // Creating content

        // Heading
        let heading = document.createElement('h3');
        heading.setAttribute('class', 'unit-heading');
        heading.innerText = utils.convertStringToTitle(data.data[i]["unit"]);
        unitContainer.appendChild(heading);

        // Accordion
        let accordion = document.createElement('div');
        accordion.setAttribute('class', 'accordion accordion-flush');
        accordion.setAttribute('id', `accordion-${data.data[i]["unit"]}`);
        unitContainer.appendChild(accordion);

        // Adding subsections
        for(let j = 0; j < data.data[i]["subsections"].length; ++j) {
            let accordionItem = document.createElement('div');
            accordionItem.setAttribute('class', 'accordion-item');

            let itemHeading = document.createElement('h2');
            itemHeading.setAttribute('class', 'accordion-header');
            itemHeading.setAttribute('id', `${data.data[i]["unit"]}-heading${j + 1}`);

            let button = document.createElement('button');
            button.setAttribute('class', 'accordion-button collapsed');
            button.setAttribute('type', 'button');
            button.setAttribute('data-bs-toggle', 'collapse');
            button.setAttribute('data-bs-target', `#${data.data[i]["unit"]}-collapse${j + 1}`);
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `${data.data[i]["unit"]}-collapse${j + 1}`);
            button.innerText = utils.convertStringToTitle(data.data[i]["subsections"][j]["subsectionName"]);

            itemHeading.appendChild(button);
            accordionItem.appendChild(itemHeading);

            let accordionCollapse = document.createElement('div');
            accordionCollapse.setAttribute('id', `${data.data[i]["unit"]}-collapse${j + 1}`);
            accordionCollapse.setAttribute('class', 'accordion-collapse collapse');
            accordionCollapse.setAttribute('aria-labelledby', `${data.data[i]["unit"]}-heading${j + 1}`);
            accordionCollapse.setAttribute('data-bs-parent', `#accordion-${data.data[i]["unit"]}`);
            
            let accordionBody = document.createElement('div');
            accordionBody.setAttribute('class', 'accordion-body');

            if(data.data[i]["subsections"][j]["theory"]) {
                let theory = document.createElement('h4');
                theory.setAttribute('class', 'theory-presentation-heading');
                theory.setAttribute('data-src', `${data.data[i]['unit']}/${data.data[i]["subsections"][j]["theory"]}`);

                let span = document.createElement('span');
                span.setAttribute('class', 'exercise-number');
                span.innerText = `Theory presentation`;
                theory.appendChild(span);

                accordionBody.appendChild(theory);
            }

            for(let k = 0; k < data.data[i]["subsections"][j]["exercises"].length; ++k) {
                accordionBody.appendChild(generateExercise(k + 1, utils.generateExercisesId(data.data[i]["unit"], data.data[i]["subsections"][j]["subsectionName"], k + 1), data.data[i]["subsections"][j]["exercises"][k]));
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

export const findExercise = (id) => {
    const unitsMap = utils.createUnitsMap();
    const subsectionsMaps = utils.createSubsectionsMaps();

    const unit = id.slice(0, id.indexOf('_'));
    const subsection = id.slice(id.indexOf('_') + 1, id.lastIndexOf('_'));
    const exNum = parseInt(id.slice(id.lastIndexOf('_') + 1));

    return data.data[unitsMap.get(unit)]['subsections'][subsectionsMaps[unitsMap.get(unit)].get(subsection)]['exercises'][exNum - 1];
}

export const generateSet = () => {
    const fragment = document.createDocumentFragment();
    let counter = 1;

    for(let i = 0; i < data.chosenSet.length; ++i) {
        let temp;

        if(data.chosenSet[i].type === 'exercise') {
            temp = convertIdToExercise(counter++, data.chosenSet[i].id);
        }
        else if(data.chosenSet[i].type === 'image') {
            temp = document.createElement('img');
            temp.setAttribute('src', `assets/${data.chosenSet[i].src}`);
            temp.setAttribute('alt', 'Theory presentation');
            temp.setAttribute('class', 'img-fluid theory-presentation-img');
        }
        else if(data.chosenSet[i].type === 'title') {
            temp = document.createElement('h2');
            temp.setAttribute('class', 'main-title');
            temp.innerText = data.chosenSet[i].content;
        }
        else if(data.chosenSet[i].type === 'heading') {
            temp = document.createElement('h3');
            temp.setAttribute('class', 'additional-heading');
            temp.innerText = data.chosenSet[i].content;
        }
        else { // when data.chosenSet[i].type === 'separator'
            temp = document.createElement('div');
            temp.setAttribute('class', 'separator');
        }

        temp.addEventListener('dblclick', () => {
            data.chosenSet.splice(i, 1);
            refreshGeneratedSet();
        });

        fragment.appendChild(temp);
    }

    return fragment;
}

export const generateAnswer = (exercise, exerciseNumber) => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('id', "answer");

    // Heading
    let heading = document.createElement('h4');
    heading.setAttribute('class', 'exercise-heading');

    let span = document.createElement('span');
    span.setAttribute('class', 'exercise-number');
    span.innerText = `Exercise ${exerciseNumber}`;

    heading.appendChild(span);
    wrapper.appendChild(heading);

    // Content
    if(exercise.answers.length > 1) {
        let list = document.createElement('ol');

        for(let oneAnswer of exercise.answers) {
            let listItem = document.createElement('li');
            listItem.innerText = oneAnswer;
            list.appendChild(listItem);
        }

        wrapper.appendChild(list);
    }
    else {
        const p = document.createElement('p');
        p.innerText = exercise.answers[0];
        wrapper.appendChild(p);
    }

    return wrapper;
}

export const generateAnswers = () => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('id', "answers");

    const generatedSet = document.querySelector('#generated-set-container');

    for(let obj of data.chosenSet) {
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
    
    if(data.chosenSet.length > 0) {
        gs.appendChild(generateSet());
    }
    else {
        const p = document.createElement('p');
        p.setAttribute('class', 'initial-text ignore-element');
        p.innerText = 'This is the place for your exercises.';
        gs.appendChild(p);
    }
}