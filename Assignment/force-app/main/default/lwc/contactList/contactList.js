import { LightningElement, wire, api } from 'lwc';
import getRelatedContacts from '@salesforce/apex/contactController.getRelatedContacts';
import { refreshApex } from '@salesforce/apex';

export default class ContactList extends LightningElement {
    @api accId;

    @wire(getRelatedContacts, { accId: '$accId' })
    contacts;

    handleUpdateAccount(event) {
        console.log('In handle Update Account');
        console.log('old contacts--', this.contacts);

        refreshApex(this.contacts);
        console.log('updated contacts--', this.contacts);
    }
}