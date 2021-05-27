const PAYMENT_OPTIONS = {default: '', splitBetweenGuest: 'Split Between Guests'};

const TABLE_ITEMS_COLUMNS = [
    {
        id        : '1',
        fieldName : 'numRow',
        label     : '#',
        type      : 'numRow'
    },
    {
        id        : '2',
        fieldName : 'itemType',
        label     : 'Item Type',
        type      : 'link'
    },
    {
        id        : '3',
        fieldName : 'description',
        label     : 'Item Description',
        type      : 'string'
    },
    {
        id        : '4',
        fieldName : 'quantity',
        label     : 'Quantity',
        type      : 'number',
        editable  : true
    },
    {
        id        : '5',
        fieldName : 'pricingType',
        label     : 'Pricing Type',
        type      : 'picklist',
        options   : [
            {label : '', value: ''},
            {label : 'Monthly', value: 'Monthly'},
            {label : 'Weekly', value: 'Weekly'},
            {label : 'Daily', value: 'Daily'},
            {label : 'Hourly', value: 'Hourly'},
            {label : 'Minutes', value: 'Minutes'}
            ],
        editable  : true
    },
    {
        id        : '6',
        fieldName : 'price',
        label     : 'Price',
        type      : 'currency',
        editable  : true
    },
    {
        id        : '7',
        fieldName : 'discount',
        label     : 'Discount',
        type      : 'percent',
        editable  : true
    },
    {
        id        : '8',
        fieldName : 'tax',
        label     : 'Tax',
        type      : 'percent',
        editable  : true
    },
    {
        id        : '9',
        fieldName : 'total',
        label     : 'Total',
        type      : 'currency',
        isFormulaField : true,
        renderEngine : (e) => e.price * e.quantity - (e.price * e.quantity * e.discount/100) + ( e.price * e.quantity * e.tax/100)
    },
    {
        id        : '10',
        fieldName : 'actions',
        label     : '',
        type      : 'actions',
        actions   : ['delete']
    }
];

const TABLE_GUEST_COLUMNS = [
    {
        id              : '1',
        fieldName       : 'rowSelection',
        label           : '',
        type            : 'rowSelection',
        width           : '15%',
        isRowsSelection : true,
    },
    {
        id        : '2',
        fieldName : 'name',
        label     : 'Name',
        type      : 'link',
        width     : '45%',

    },
    {
        id        : '3',
        fieldName : 'numGuest',
        label     : '# of Guest',
        type      : 'number',
        width     : '15%'
    },
    {
        id        : '4',
        fieldName : 'amount',
        label     : 'Amount',
        type      : 'currency',
        width     : '25%',
        editable  : true
    },
    {
        id        : '5',
        fieldName : 'actions',
        label     : '',
        type      : 'actions',
        actions   : ['delete'],
        width     : '10%'
    },
];

export default {
    TABLE_ITEMS_COLUMNS,
    TABLE_GUEST_COLUMNS,
    PAYMENT_OPTIONS
}