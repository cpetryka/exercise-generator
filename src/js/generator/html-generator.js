class HtmlGenerator {
    static generateHtmlElement(elementType, attributes = {}) {
        const div = document.createElement(elementType);

        const allowedAttributes = ['id', 'class', 'src', 'alt', 'data-src', 'data-bs-toggle', 'data-bs-target', 'aria-expanded', 'aria-controls', 'aria-labelledby', 'data-bs-parent' ];

        for(let key in attributes) {
            if(allowedAttributes.includes(key)) {
                div.setAttribute(key, attributes[key]);
            }
        }

        if(attributes.text !== undefined && attributes.text.length) {
            div.innerText = attributes.text;
        }

        if(attributes.html !== undefined && attributes.html.length) {
            div.innerHTML = attributes.html;
        }

        return div;
    }
}

export default HtmlGenerator;