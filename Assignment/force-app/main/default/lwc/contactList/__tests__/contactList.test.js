import { createElement } from 'lwc';
import ContactList from 'c/contactList';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getRelatedContacts from '@salesforce/apex/contactController.getRelatedContacts';

const mockRelatedContacts = require('./data/getRelatedContacts.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getrelatedContactsAdapter = registerApexTestWireAdapter(getRelatedContacts);

function flushPromises() {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setImmediate(resolve));
}

describe('c-contact-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('renders two records when data is returned', () => {
        const element = createElement('c-contact-list', {
            is: ContactList
        });
        element.accId = "0012w00000NwHvgAAZ";
        document.body.appendChild(element);

        // Emit data from @wire
        getrelatedContactsAdapter.emit(mockRelatedContacts);

        return Promise.resolve().then(() => {
            // Select elements for validation
            const detailEls = element.shadowRoot.querySelectorAll('c-contact-tile');
            expect(detailEls.length).toBe(mockRelatedContacts.length);
            console.log('detailEls length --', detailEls.length);
            expect(detailEls[0].contact.Id).toBe(
                mockRelatedContacts[0].Id
            );
        });
    });

    it('check updateAccount event handler', async() => {
        const element = createElement('c-contact-list', {
            is: ContactList
        });
        element.accId = "0012w00000NwHvgAAZ";
        document.body.appendChild(element);

        getrelatedContactsAdapter.emit(mockRelatedContacts);

        await flushPromises();
        const handler = jest.fn();
        element.addEventListener('updateaccount', handler);
        const childEl = element.shadowRoot.querySelectorAll('c-contact-tile');


        // Set the payload of the event
        const eventPayload = {
            detail: mockRelatedContacts[0]
        };
        childEl[0].dispatchEvent(new CustomEvent('updateaccount'), eventPayload);
        await Promise.resolve();
        expect(handler).toHaveBeenCalled();


    });
});