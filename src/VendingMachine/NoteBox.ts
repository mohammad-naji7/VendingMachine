import MoneySlot from "./MoneySlot";
import CashCurrency from './CashCurrency';

const defaultNoteCurrencies: CashCurrency[] = [
  new CashCurrency('$20', 20, 'Note', 0),
  new CashCurrency('$50', 50, 'Note', 0),
]

class NoteBox implements MoneySlot {
  constructor(
    private _noteCurrencies: CashCurrency[] = defaultNoteCurrencies
  ) {}

  addNoteCurrency(newNote: CashCurrency): void {
    let didPass: boolean = false
    this._noteCurrencies = this._noteCurrencies.map(note => {
      if(note.label === newNote.label){
        didPass= true;
        return new CashCurrency(note.label, note.value, note.type, note.count + newNote.count)
      }
      return note;
    })

    if(!didPass){
      throw Error('The passed note is not supported in the box');
    }
  }

  dispenseNote(dispensedNote: CashCurrency): void {
    let didPass: boolean = false
    this._noteCurrencies = this._noteCurrencies.map(note => {
      if(note.label === dispensedNote.label){
        didPass= true;
        return new CashCurrency(note.label, note.value, note.type, note.count - dispensedNote.count)
      }
      return note;
    })

    if(!didPass){
      throw Error('The passed note is not supported in the box');
    }
  }

  get noteCurrencies(): CashCurrency[] {
    return this._noteCurrencies
  }

  
  getBalance(): number {
    return this._noteCurrencies.reduce((sum, note) => sum += (note.count * note.value), 0);
  }

  reset(): void {
    this._noteCurrencies.forEach(note => {
      note.count = 0
    })
  }
}

export default NoteBox;
