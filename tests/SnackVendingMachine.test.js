const { default: Snack} = require('../dist/Snack');
const { default: CoinBox} = require('../dist/VendingMachine/CoinBox');
const { default: NoteBox} = require('../dist/VendingMachine/NoteBox');
const { default: CardSlot} = require('../dist/VendingMachine/CardSlot');
const { default: Keypad} = require('../dist/VendingMachine/Keypad');
const { default: Position} = require('../dist/VendingMachine/Position');
const { default: CashCurrency} = require('../dist/VendingMachine/CashCurrency');
const { default: SnackVendingMachine} = require('../dist/SnackVendingMachine');

const snacks = [
    [
        new Snack('Lays', 'classic', 1, 5),
        new Snack('Reese\'s', 'Peanut butter cups', 1.5, 2)
    ],
    [
        new Snack('m & m\'s', 'Milk Chocolate', .75, 2),
        new Snack('Doritos', 'Nacho cheese', 2, 3),

    ]
];

const coinSlot = new CoinBox();

const noteSlot = new NoteBox();

const cardSlot = new CardSlot();

const keypad = new Keypad([0, 1]);

const coinBalance = new CoinBox();
coinBalance.addCoinCurrency(new CashCurrency('10C', 0.1, 'Coin', 30));
coinBalance.addCoinCurrency(new CashCurrency('20C', 0.2, 'Coin', 20));
coinBalance.addCoinCurrency(new CashCurrency('50C', 0.5, 'Coin', 20));
coinBalance.addCoinCurrency(new CashCurrency('$1', 1, 'Coin', 50));

const noteBalance = new NoteBox();
noteBalance.addNoteCurrency(new CashCurrency('$20', 20, 'Note', 15));
noteBalance.addNoteCurrency(new CashCurrency('$50', 50, 'Note', 7));

const findCashCurrencyCountByLabel = (list, label) => list.find(cashCurrency => cashCurrency.label === label).count

// This is more like integration test than a unit test XD
describe("Main Class", () => {
    test('Should select a snack and perform trx and update the snack quantity in the inventory and calculate the change and the machine balance', () => {
        const mySVM = new SnackVendingMachine(snacks, keypad, null, cardSlot, coinSlot, noteSlot, coinBalance, noteBalance);
        keypad.currentSelection = new Position(1, 1);

        // Evaluate the selected item as expected
        expect(mySVM.getTheSelectedItem().brand).toBe('Doritos')
        expect(mySVM.getTheSelectedItem().name).toBe('Nacho cheese')

        mySVM.paymentMethod = 'Cash'
        coinSlot.addCoinCurrency(new CashCurrency('$1', 1, 'Coin', 1))
        noteSlot.addNoteCurrency(new CashCurrency('$50', 50, 'Note', 1))

        // Evaluate the inserted balance in the coin/note slots
        expect(mySVM.getInsertedBalance()).toBe(51);

        const change = mySVM.calculateChange();

        // Evaluate the change distribution
        expect(findCashCurrencyCountByLabel(change, '10C')).toBe(0);
        expect(findCashCurrencyCountByLabel(change, '20C')).toBe(0);
        expect(findCashCurrencyCountByLabel(change, '50C')).toBe(0);
        expect(findCashCurrencyCountByLabel(change, '$1')).toBe(9);
        expect(findCashCurrencyCountByLabel(change, '$20')).toBe(2);
        expect(findCashCurrencyCountByLabel(change, '$50')).toBe(0);
    
        mySVM.purchaseItem();
    
        // Evaluate the left quantity of the snack in the VM inventory
        expect(mySVM.items[1][1].quantity).toBe(2);
        
        // Evaluate the VM balance distribution
        expect(findCashCurrencyCountByLabel(mySVM.coinBalance.coinCurrencies, '10C')).toBe(30)
        expect(findCashCurrencyCountByLabel(mySVM.coinBalance.coinCurrencies, '20C')).toBe(20)
        expect(findCashCurrencyCountByLabel(mySVM.coinBalance.coinCurrencies, '50C')).toBe(20)
        expect(findCashCurrencyCountByLabel(mySVM.coinBalance.coinCurrencies, '$1')).toBe(42)
        expect(findCashCurrencyCountByLabel(mySVM.noteBalance.noteCurrencies, '$20')).toBe(13)
        expect(findCashCurrencyCountByLabel(mySVM.noteBalance.noteCurrencies, '$50')).toBe(8)

        // Evaluate the total balance of the VM
        expect(mySVM.machineBalance).toBe(719);
      });
})