import { LightningElement, api } from 'lwc';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import ACCOUNTID_FIELD from '@salesforce/schema/Contact.AccountId';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactTile extends LightningElement {
    //@api contact;
    @api
    set contact(value = {}) {
        if (value) {
            this.contactDetail = value;
        }
    }
    get contact() {
        return this.contactDetail;
    }

    contactDetail = {};
    seeButtons = 'true';
    accountId;
    newAccount = '';

    renderedCallback() {
        console.log('In rendered callback');
        this.accountId = this.contact.AccountId;
        console.log('Account id--', this.accountId);
    }
    handleChange(event) {
        console.log('In handle change');
        this.newAccount = event.target.value;
        console.log('new Account--', this.newAccount);
    }

    handleReset(event) {
        console.log('In handle reset');
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    handleSuccess(event) {

        console.log('In handle Success');
        console.log('old account ----', this.accountId);
        console.log('new Account----', this.newAccount);

        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.contact.Id;
        fields[EMAIL_FIELD.fieldApiName] = this.contactDetail.Email;
        fields[PHONE_FIELD.fieldApiName] = this.contactDetail.Phone;

        if (this.accountId !== this.newAccount && this.newAccount !== '') {
            console.log('In if');
            fields[ACCOUNTID_FIELD.fieldApiName] = this.newAccount;
        }

        event.preventDefault();
        console.log('prevent default executes');

        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                console.log('In update record');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Success",
                        messages: "Account updated",
                        variant: "success"
                    })
                );

                this.dispatchEvent(new CustomEvent('updateaccount', { detail: { value: this.contactDetail } }));
            })
    }

}