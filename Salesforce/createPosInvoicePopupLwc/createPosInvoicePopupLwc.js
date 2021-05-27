import { LightningElement, api, track, wire } from 'lwc';
import { loadStyle }        from 'lightning/platformResourceLoader';
import { NavigationMixin }  from 'lightning/navigation';
import brandStyles          from '@salesforce/resourceUrl/CreateInvoiceStyles';
import invoiceInit          from '@salesforce/apex/CreateInvoicePopupLwcCtrl.initInvoice';
import createInvoice        from '@salesforce/apex/CreateInvoicePopupLwcCtrl.createInvoice';
import LABELS               from './createPosInvoicePopupLwcLabels';
import COMPONENT_CONSTANTS  from './createPosInvoicePopupLwcConstants';
import {Utils}              from 'c/utils';

import {publish, MessageContext} from "lightning/messageService";
import INVOICE_EVENT from '@salesforce/messageChannel/reservationRecordPageInvoiceEvent__c';

import { CONSTANS, PubSub } from 'c/customDataTableService';


export default class CreatePosInvoicePopupLwc extends NavigationMixin(LightningElement) {
    LABELS            = LABELS;
    tableItemsColumns = COMPONENT_CONSTANTS.TABLE_ITEMS_COLUMNS
    tableGuestColumns = COMPONENT_CONSTANTS.TABLE_GUEST_COLUMNS
    @track itemsTableRecords;
    @track itemsGuestRecords;

    @api recordId;
    isLoading;
    initialized;
    renderTrigger = 0;
    @wire(MessageContext) messageContext;

    get paymentOptions() {
        return Object.values(COMPONENT_CONSTANTS.PAYMENT_OPTIONS).map(option => {
            return {label : option, value : option }
        })
    }

    get itemTableRecords() {
        return (this.itemTable) ? this.itemTable.iteratedRecords : [];
    }

    get subTotal() {
        return Math.round(this.itemTableRecords.reduce((total, row) => Number(total) + (Number(row['price']) * Number(row['quantity'])) , 0) * 100) / 100;
    }
    get discount() {
        return Math.round(this.itemTableRecords.reduce((total, row) => Number(total) + Number(row['discount']) * (Number(row['price']) * Number(row['quantity'])) * 0.01, 0) *100 ) / 100;
    }
    get tax() {
        return Math.round(this.itemTableRecords.reduce((total, row) => total + Number(row['tax']) * (Number(row['price']) * Number(row['quantity'])) * 0.01, 0) * 100) / 100;
    }
    get grandTotal() {
        return Math.round((this.subTotal - this.discount + this.tax) * 100) / 100;
    }

    get isValidInvoiceData() {
        const summaAmountGuest = this.selectedGuests.reduce((total, row) => Number(total) + Number(row['amount']) , 0);
        if (this.selectedGuests.length === 0) {
            Utils.Notification.show('WARNING!', 'No guests with amount more then 0', Utils.Notification.TYPE.WARNING);
            return false;
        } else if (summaAmountGuest != this.grandTotal) {
            Utils.Notification.show('WARNING!', 'Amount all guests must be equal ' + this.grandTotal, Utils.Notification.TYPE.WARNING);
            return false;
        }
        return true
    }

    connectedCallback() {
        PubSub.subscribe(CONSTANS.EVENT_RENDERED_TABLE, this.refreshComponent, this)
        PubSub.subscribe(CONSTANS.EVENT_CHANGE_CELL_VALUE, this.refreshComponent, this)
        PubSub.subscribe(CONSTANS.EVENT_NAVIGATION, this.handleNavigationEvent, this)

        loadStyle(this, brandStyles);
        this.init();
    }

    renderedCallback() {
        if (!this.initialized && this.itemTable && this.guestTable) {
            this.initialized = true;
            this.paymentTypePicklist.value = COMPONENT_CONSTANTS.PAYMENT_OPTIONS.splitBetweenGuest;
            this.splitAmountBetweenGuests();
        }
    }

    disconnectedCallback() {
        PubSub.unsubscribe(CONSTANS.EVENT_DELETE_ROW, this.refreshComponent, this);
        PubSub.unsubscribe(CONSTANS.EVENT_CHANGE_CELL_VALUE, this.refreshComponent, this);
    }

     init() {
         this.isLoading = true;
         invoiceInit({recordId : this.recordId})
            .then(result => this.parseResult(result))
            .catch(error =>  Utils.handleError(error))
            .finally(() => this.isLoading = false)
    }

    handleAddAddonServices(e) {
        e.preventDefault();
        this.addAddonModalWindow.openModal();
    }

    handleCancelAddAddonModalWindow() {
        this.addAddonModalWindow.closeModal();
    }

    handleAddAddonModalWindow() {
        this.addAddonComponent.addAddon();
    }

    handleNavigationEvent({recordId, row}) {
        if (row.isRoom) {
            this.navigateTo(row.room.Id);
        } else {
            this.navigateTo(recordId);
        }
    }

    handleAddingAddon(event) {
        const addon = event.detail;
        if (!addon) return

        const generateRow = {
            Id            : addon.Id,
            itemType      : addon.Name ? addon.Name : '',
            description   : '',
            quantity      : addon.Quantity__c,
            pricingType   : '',
            price         : addon.Price__c,
            discount      : 0,
            tax           : 0,
            total         : addon.Price__c,
            isNotDeletable: false,
            isAddon       : true,
            isNew         : true,
            initialValues : {
                quantity    : '',
                pricingType : '',
                price       : '',
                discount    : '',
                tax         : '',
                total       : '',
            }
        } ;

        this.itemTable.addNewRow(generateRow);
        this.addAddonModalWindow.closeModal();
    }

    parseResult = (result) => {
        if (result.room.length === 0 ) {
            Utils.Notification.show('WARNING', 'No selected rooms', Utils.Notification.TYPE.WARNING, 'sticky');
        }
        this.itemsTableRecords = [...result.room, ...result.services];
        this.itemsGuestRecords = result.guests;
    }

     navigateTo = async (recordId) => {
        const url = await this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        });
        window.open(url, '_blank');
    }

    refreshComponent = () => {
        ++this.renderTrigger;
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleResetAll() {
        this.init();
        this.paymentTypePicklist.value = COMPONENT_CONSTANTS.PAYMENT_OPTIONS.default;
    }

    handleSaveInvoices() {
        if(this.isValidInvoiceData) {
            const invoices     = this.prepareInvoices;
            const addons       = this.prepareAddons;
            const deletedItems = this.itemTable.deletedRecords;

            this.isLoading = true;

            createInvoice({inputArguments : {
                'invoices'      : invoices,
                'addons'        : addons,
                'deletedItems'  : deletedItems,
                'reservationId' : this.recordId
            } })
            .then(() => {
                publish(this.messageContext, INVOICE_EVENT, {
                    name : 'create invoice'
                });
                Utils.Notification.show('SUCCESS!', 'Invoices are Successfully Created', Utils.Notification.TYPE.SUCCESS);
            })
            .catch((error) => {
                Utils.handleError(error);
            })
            .finally(() => {
                this.isLoading = false;
                this.closeModal();
            })
        }
    }

    makeAddonWrapper = (row) => {
        const addon = {
            Id              : row.isNew ? null : row.Id,
            quantity        : row.quantity,
            pricingType     : row.pricingType,
            price           : row.price,
            discountPercent : row.discount,
            tax             : row.tax,
            reservationId   : this.recordId
        }
        return addon;
    }

    makeInvoiceWrapper = (guest) => {
        const percentSplitBetwwenGuests = parseFloat(Number(guest.amount) / this.grandTotal).toFixed(2);
        const invoice = {
            grandTotal     : guest.amount,
            reservationId  : this.recordId,
            guestId        : guest.Id,
            subtotal       : Math.round(Number(percentSplitBetwwenGuests) * this.subTotal * 100) / 100 ,
            discount       : Math.round(Number(percentSplitBetwwenGuests) * this.discount * 100) / 100 ,
            tax            : Math.round(Number(percentSplitBetwwenGuests) * this.tax * 100) / 100 ,

        }
        return invoice
    }

    handleChangePaymentOptions(event) {
        switch (event.detail.value) {
            case COMPONENT_CONSTANTS.PAYMENT_OPTIONS.default:
                this.resetAmountGuest();
                break;
            case COMPONENT_CONSTANTS.PAYMENT_OPTIONS.splitBetweenGuest:
                this.splitAmountBetweenGuests();
                break;
        }
    }

    splitAmountBetweenGuests() {
        if (this.numSelectedGuests === 0) {
            this.guestTable.rows.forEach(row => row.selectRow());
        }
        const splitedAmount = this.grandTotal / this.numSelectedGuests;

        this.guestTable.iteratedRecords.forEach(row => {
            if (row.isSelected) {
                this.guestTable.addTableValueToRow(row.Id, 'amount', splitedAmount)
            }
        });
    }

    resetAmountGuest() {
        this.guestTable.iteratedRecords.forEach(row => {
            this.guestTable.addTableValueToRow(row.Id, 'amount', 0);
        });
    }

    get prepareInvoices() {
         return this.selectedGuests.map(guest => this.makeInvoiceWrapper(guest));
    }

    get prepareAddons() {
         return this.itemTable.iteratedRecords.filter(row => row.isAddon == true && row.isChanged || row.isAddon == true && row.isNew).map(row => this.makeAddonWrapper(row));
    }

    get numSelectedGuests() {
        return this.guestTable.iteratedRecords.reduce((prev, curr) => {
            return (curr.isSelected) ? prev + 1 : prev;
        }, 0);
    }

    get paymentTypePicklist() {
        return this.template.querySelector('lightning-combobox.payment-options')
    }

    get selectedGuests() {
        return this.guestTable.iteratedRecords.filter(guest => guest.isSelected > 0)
    }

    get itemTable() {
        return this.template.querySelector('c-custom-data-table.item-table')
    }

    get guestTable() {
        return this.template.querySelector('c-custom-data-table.guest-table')
    }

    get addAddonModalWindow() {
        return this.template.querySelector('c-modal-window-lwc.add-addon');
    }
    get addAddonComponent() {
        return this.template.querySelector('c-reservation-record-page-add-addon');
    }

    
    get demoOptions() {
        return [
            { label: 'option1', value: 'option1' },
            { label: 'option2', value: 'option2' },
            { label: 'option3', value: 'option3' },
        ];
    }
}