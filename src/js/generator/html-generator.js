class HtmlGenerator {
    static generateHtmlElement(elementType, attributes = {}) {
        const element = document.createElement(elementType);

        // Setting attributes
        const allowedAttributes = ['id', 'class', 'src', 'alt', 'data-src', 'data-bs-toggle', 'data-bs-target', 'aria-expanded', 'aria-controls', 'aria-labelledby', 'data-bs-parent' ];

        for(let attribute in attributes) {
            if(allowedAttributes.includes(attribute)) {
                element.setAttribute(attribute, attributes[attribute]);
            }
        }

        // Setting text and/or html
        if(attributes.text !== undefined && attributes.text.length) {
            element.innerText = attributes.text;
        }

        if(attributes.html !== undefined && attributes.html.length) {
            element.innerHTML = attributes.html;
        }

        return element;
    }
}

export default HtmlGenerator;