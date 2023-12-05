import HtmlGenerator from "./html-generator";

class HtmlContentGenerator {
    static createTheoryImage = src => {
        return HtmlGenerator.generateHtmlElement('img', { src: `assets/${src}`, alt: 'Theory presentation', class: 'img-fluid theory-presentation-img' });
    }

    static createTitle = text => {
        return HtmlGenerator.generateHtmlElement('h2', { class: 'main-title', text: text });
    }

    static createHeading = text => {
        return HtmlGenerator.generateHtmlElement('h3', { class: 'additional-heading', text: text });
    }

    static createNote = text => {
        return HtmlGenerator.generateHtmlElement('p', { class: 'note', text: text });
    }

    static createSeparator = () => {
        return HtmlGenerator.generateHtmlElement('div', { class: 'separator' });
    }
}

export default HtmlContentGenerator;