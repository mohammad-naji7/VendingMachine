import SnackVendingMachine from './SnackVendingMachine';
import Snack from './Snack'
import CoinBox from './VendingMachine/CoinBox'
import NoteBox from './VendingMachine/NoteBox'
import CardSlot from './VendingMachine/CardSlot'
import Keypad from './VendingMachine/Keypad'
import Position from './VendingMachine/Position';
import CashCurrency from './VendingMachine/CashCurrency';

// In the Doc specifies 5 rows with 5 snacks per row
// For brevity i am filling 2 rows with 2 snacks per row :D
const snacks: Snack[][] = [
    [
        new Snack('Lays', 'classic', 1, 5),
        new Snack('Reese\'s', 'Peanut butter cups', 1.5, 2)
    ],
    [
        new Snack('m & m\'s', 'Milk Chocolate', .75, 2),
        new Snack('Doritos', 'Nacho cheese', 2, 3),

    ]
];

const coinSlot: CoinBox = new CoinBox();

const noteSlot: NoteBox = new NoteBox();

const cardSlot: CardSlot = new CardSlot();

const keypad: Keypad = new Keypad([0, 1]);

const coinBalance: CoinBox = new CoinBox();
coinBalance.addCoinCurrency(new CashCurrency('10C', 0.1, 'Coin', 30));
coinBalance.addCoinCurrency(new CashCurrency('20C', 0.2, 'Coin', 20));
coinBalance.addCoinCurrency(new CashCurrency('50C', 0.5, 'Coin', 20));
coinBalance.addCoinCurrency(new CashCurrency('$1', 1, 'Coin', 50));

const noteBalance: NoteBox = new NoteBox();
noteBalance.addNoteCurrency(new CashCurrency('$20', 20, 'Note', 15));
noteBalance.addNoteCurrency(new CashCurrency('$50', 50, 'Note', 7));

(function Main() {
    const mySVM = new SnackVendingMachine(snacks, keypad, null, cardSlot, coinSlot, noteSlot, coinBalance, noteBalance);

    // The customer selects a number by pressing on the keypad.
    keypad.currentSelection = new Position(1, 1);
    if(!mySVM.checkIsSelectedItemValid()){
        console.log("Selection does not match any item");
        return
    }

    if(mySVM.checkIsSelectedItemAvailable()){
        // The VM displays a message that the snack is available for the selected number and displays its price.
        const selectedSnack = mySVM.getTheSelectedItem();
        console.log(`Selected Item: ${selectedSnack?.brand} ${selectedSnack?.name}, Price: ${selectedSnack?.price}`)

        // The customer inserts the money.
        // The VM displays the accumulated amount of money each time a new money is entered.
        // The VM monitors the amount of the accepted money, If the money is enough, perform purchase trx

        while(!mySVM.checkIsInsertedMoneyEnough()){
            // this would be set automatically as the hardware detects which slot is used
            mySVM.paymentMethod = 'Cash'
            console.log(`Not enough money, Entered: ${mySVM.getInsertedBalance()}`)

            // The customer inserts the money.
            // The VM validates the money.
            // The VM accepts the money. 
            coinSlot.addCoinCurrency(new CashCurrency('$1', 1, 'Coin', 1))
            noteSlot.addNoteCurrency(new CashCurrency('$50', 50, 'Note', 1))
        }

        if(!mySVM.checkIsMachineBalanceEnoughForTrx()) {
            console.log('The machine have no change');
            mySVM.reset();
            return
        }

        mySVM.purchaseItem();
        console.log('Transaction Done, Find your snack in the pickup box')
        
        // The VM determines if any change should be sent back to customer.
        if(mySVM.checkShouldReturnChange()){
            // The VM displays the change at panel. 
            console.log("Change slots: ", (mySVM.calculateChange() ?? []).filter(cashCategory => cashCategory.count !== 0).map((cashCategory) => `${cashCategory.label} x ${cashCategory.count}`).join(', '))
            // Then, the VM dispenses change.
            mySVM.dispenseChange();
        } else {
            console.log('No change to dispense')
        }

        // reset for the next trx
        mySVM.reset();

        console.log("Now the balance inside the machine is: ", mySVM.machineBalance);

    }
    else {
        console.log("The selected item is not available (Sold out)");
    }
  }());