import VMItem from './Item';
import CoinBox from './CoinBox';
import NoteBox from './NoteBox';
import CardSlot from './CardSlot';
import Keypad from './Keypad';
import CashCurrency from './CashCurrency';

export type PaymentMethod = 'Card' | 'Cash';
export type PurchaseStatus = 'resolved' | 'rejected';

// This could have been an interface, but i ended up making it a class
// as i am under the impression that different vending machines will have the same logic
// circling around an item with price/quantity and how to manage the money/balance
  class VendingMachine<T extends VMItem> {
    constructor(
      public items: T[][],
      public keypad: Keypad,
      // The current implementation does not account for switching the payment method
      // (ie: insert coins, then insert a card)  
      public paymentMethod: PaymentMethod | null = null,
      public cardSlot: CardSlot,
      public coinSlot: CoinBox,
      public noteSlot: NoteBox,
      private coinBalance: CoinBox,
      private noteBalance: NoteBox
    ) {}

    get machineBalance() {
        // if(userInfo.have(permissions))
        return this.coinBalance.getBalance() + this.noteBalance.getBalance();
    }

    getTheSelectedItem(): T | null {
        if(this.keypad.currentSelection?.row && this.keypad.currentSelection?.column){
            const selectedItem = this.items[this.keypad.currentSelection.row][this.keypad.currentSelection.column];  
            
            return selectedItem
        }

        return null
    }

    getInsertedBalance(): number{
        if(!this.paymentMethod) return 0

        if(this.paymentMethod === 'Card'){
            return this.cardSlot.getBalance()
        }
        
        return this.coinSlot.getBalance() + this.noteSlot.getBalance();
    }

    calculateChange(): CashCurrency[] | null {
        const selectedItem = this.getTheSelectedItem(); 
        
        if(!selectedItem || !this.checkShouldReturnChange()) return null;

        const change = this.getInsertedBalance() - (selectedItem as T).price;

        const availableCoinCurrencies = new CoinBox();
        const availableNoteCurrencies = new NoteBox();
       
        [...this.coinSlot.coinCurrencies, ...this.coinBalance.coinCurrencies].forEach(coin => {
            availableCoinCurrencies.addCoinCurrency(coin);
        });
        [...this.noteSlot.noteCurrencies, ...this.noteBalance.noteCurrencies].forEach(note => {
            availableNoteCurrencies.addNoteCurrency(note);
        });

        let changeDistribution: CashCurrency[] = []
        
        const changeLeftover = [...availableCoinCurrencies.coinCurrencies, ...availableNoteCurrencies.noteCurrencies].sort((a, b) => b.value - a.value).reduce((leftChange, cashCategory) => {
            const categoryChangeCount = Math.floor(leftChange / cashCategory.value);

            if(cashCategory.count >= categoryChangeCount) {
                    changeDistribution.push(new CashCurrency(cashCategory.label, cashCategory.value, cashCategory.type, categoryChangeCount))
                    return leftChange % cashCategory.value
            }
            else {
                return leftChange
            }
        }, change);

        return changeLeftover === 0 ? changeDistribution : null

    }

    checkIsSelectedItemValid(): boolean {
        const selectedItem = this.getTheSelectedItem();

        if(!selectedItem) return false;

        return true
    }

    checkIsSelectedItemAvailable(): boolean {
        const selectedItem = this.getTheSelectedItem();

        if(!selectedItem) return false;

        return selectedItem.quantity > 0
    }

    checkIsInsertedMoneyEnough(): boolean {
        if(!this.checkIsSelectedItemValid()) return false;

        return (this.getTheSelectedItem() as T).price <= this.getInsertedBalance()
    }

    checkIsItemPurchasable(): boolean {
        
        if(!this.checkIsSelectedItemValid()) return false;
        if(!this.checkIsSelectedItemAvailable()) return false;
        if(!this.checkIsInsertedMoneyEnough()) return false;

        return true
    }

    checkShouldReturnChange(): boolean {
        const selectedItem = this.getTheSelectedItem();
        
        if(!selectedItem) return false;

        return selectedItem.price < this.getInsertedBalance()
    }

    checkIsMachineBalanceEnoughForTrx(): boolean {
        const change = this.calculateChange();

        return change !== null;
    }

    dispenseChange(): void {
        // this method currently not doing anything special for the sake of the simulation
        // but in real life scenario it would work with the hardware to free the change
                
        if(this.paymentMethod === 'Card' || !this.paymentMethod || !this.checkShouldReturnChange()) return
        
        this.freeTheInsertedBalance()
    }

    freeTheInsertedBalance(): void {
        if(!this.paymentMethod) return

        if(this.paymentMethod === 'Card'){
            this.cardSlot.reset();
            return
        }

        this.coinSlot.reset();
        this.noteSlot.reset();
    }

    payForTheSelectedItem(): void {
        if(!this.checkIsSelectedItemValid() || !this.checkIsMachineBalanceEnoughForTrx()) return;
        const { price} = this.getTheSelectedItem() as T; 

        const change = this.calculateChange() as CashCurrency[];

        const availableCoinCurrencies = new CoinBox();
        const availableNoteCurrencies = new NoteBox();
       
        [...this.coinSlot.coinCurrencies, ...this.coinBalance.coinCurrencies].forEach(coin => {
            availableCoinCurrencies.addCoinCurrency(coin);
        });
        [...this.noteSlot.noteCurrencies, ...this.noteBalance.noteCurrencies].forEach(note => {
            availableNoteCurrencies.addNoteCurrency(note);
        });
        
        this.coinBalance = availableCoinCurrencies;
        this.noteBalance = availableNoteCurrencies;

        const coinChange = change.filter(changeCurrency => changeCurrency.type === 'Coin')
        const noteChange = change.filter(changeCurrency => changeCurrency.type === 'Note')
        
        coinChange.forEach(coin => {
            this.coinBalance.dispenseCoin(coin)
        })
        noteChange.forEach(note => {
            this.noteBalance.dispenseNote(note)
        })
    }

    purchaseItem(): PurchaseStatus {
        const selectedItem = this.getTheSelectedItem();

        if(!this.checkIsItemPurchasable()){
            return 'rejected';
        }

        this.payForTheSelectedItem();
        // This machine does not support mass trx
        // only one at the time for now :p 
        (selectedItem as T).quantity -= 1;
        return 'resolved';
    }

    reset(): void{
        this.keypad.resetSelection();
        this.dispenseChange();
    }
  }

  export default VendingMachine;