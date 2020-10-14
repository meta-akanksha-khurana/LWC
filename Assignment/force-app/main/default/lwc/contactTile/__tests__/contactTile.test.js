import { createElement } from 'lwc';
import ContactTile from 'c/contactTile';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

const CONTACT_INPUT = {
    Id: '0031700000pJRRSAA4',
    Name: 'Amy Taylor',
    Title: 'VP of Engineering',
    Phone: '4152568563',
    Email: 'amy@demo.net',
    AccountId: '0012w00000NwHvgAAZ'
};

describe('c-contact-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    it('renders Name, Phone, Title, Email, AccountId based on public propert input', () => {
        const element = createElement('c-contact-tile', {
            is: ContactTile
        });

        //set public property
        element.contact = CONTACT_INPUT;
        document.body.appendChild(element);

        // Validate if correct parameters have been passed to base components
        const formEl = element.shadowRoot.querySelector(
            'lightning-record-edit-form'
        );
        expect(formEl.recordId).toBe(CONTACT_INPUT.Id);
        expect(formEl.objectApiName).toBe('Contact');

        //select elements for validation
        const nameEls = element.shadowRoot.querySelector('lightning-card');
        expect(nameEls.title).toBe(CONTACT_INPUT.Name);

        const outputFieldNames = Array.from(
            element.shadowRoot.querySelectorAll('lightning-output-field')
        )[0].fieldName;
        expect(outputFieldNames).toEqual('Title');

        const INPUT_FIELDS = ['Email', 'Phone', 'AccountId'];
        const inputFieldNames = Array.from(
            element.shadowRoot.querySelectorAll('lightning-input-field')
        ).map((inputField) => inputField.fieldName);
        expect(inputFieldNames).toEqual(INPUT_FIELDS);


    });

    it('Check if toast event is called on updating contact other that AccountId on it', () => {
        const element = createElement('c-contact-tile', {
            is: ContactTile
        });

        //set public property
        element.contact = CONTACT_INPUT;
        document.body.appendChild(element);

        // Mock handler for toast event
        const handler = jest.fn();

        // Add event listener to catch toast event
        element.addEventListener(
            'lightning__showtoast', handler);

        //const inputEl = element.shadowRoot.querySelector('lightning-input-field[field-name="Phone"]');
        const inputEl = Array.from(
            element.shadowRoot.querySelectorAll('lightning-input-field')
        )[1];
        expect(inputEl.fieldName).toEqual('Phone');

        inputEl.value = '1234567890';
        inputEl.dispatchEvent(new CustomEvent('change'));


        const buttonEl = element.shadowRoot.querySelector('lightning-button[title="Save Record"]');
        expect(buttonEl.label).toBe('Save');
        buttonEl.click();

        return Promise.resolve().then(() => {
            expect(handler).toHaveBeenCalled();
        })
    });

    it('check if handleChange is called and toast event is fired', () => {
        const element = createElement('c-contact-tile', {
            is: ContactTile
        });

        //set public property
        element.contact = CONTACT_INPUT;
        element.newAccount = '';
        document.body.appendChild(element);

        // Mock handler
        const handler = jest.fn();
        //const handler1 = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener(
            'lightning__showtoast', handler);

        //element.addEventListener('handleChange', handler1);
        const inputEl = Array.from(
            element.shadowRoot.querySelectorAll('lightning-input-field')
        )[2];

        inputEl.value = '0012w00000ABCdeFGH';
        inputEl.dispatchEvent(new CustomEvent('change'));

        //expect(handler1).toHaveBeenCalled();
        const buttonEl = element.shadowRoot.querySelector('lightning-button[title="Save Record"]');
        expect(buttonEl.label).toBe('Save');
        buttonEl.click();

        return Promise.resolve().then(() => {
            expect(handler).toHaveBeenCalled();
            const inputAccEl = Array.from(
                element.shadowRoot.querySelectorAll('lightning-input-field')
            )[2];
            expect(inputAccEl.value).toBe('0012w00000ABCdeFGH');
        })


    });
});