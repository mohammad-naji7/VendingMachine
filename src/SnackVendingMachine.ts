import VendingMachine from './VendingMachine/VendingMachine'
import Snack from './Snack'
import CoinBox from './VendingMachine/CoinBox'
import NoteBox from './VendingMachine/NoteBox'
import CardSlot from './VendingMachine/CardSlot'
import Keypad from './VendingMachine/Keypad'
import { PaymentMethod } from './VendingMachine/VendingMachine'
  
  class SnackVendingMachine extends VendingMachine<Snack> {
    constructor(
      snackItems: Snack[][],
      keypad: Keypad,
      paymentMethod: PaymentMethod | null,
      cardSlot: CardSlot,
      coinSlot: CoinBox,
      noteSlot: NoteBox,
      coinBalance: CoinBox,
      noteBalance: NoteBox
    ) {
      super(snackItems, keypad, paymentMethod, cardSlot, coinSlot, noteSlot, coinBalance, noteBalance);
    }

  }
  
  export default SnackVendingMachine;
  