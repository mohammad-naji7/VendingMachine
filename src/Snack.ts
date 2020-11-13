import VMItem, { ItemType } from './VendingMachine/Item';

class Snack implements VMItem {
    private _type: ItemType = "Snack";
  
    constructor(
      public brand: string,
      public name: string,
      private _price: number,
      private _quantity: number,
    ) {}

    set price(value: number){
        // maybe -> if(user.have(permission))
        this._price = value;
    }

    set quantity(value: number) {
      this._quantity = value;
    }
  
    get price(): number {
      return this._price;
    }
  
    get quantity(): number {
      return this._quantity;
    }
  
    get type(): ItemType {
      return this._type;
    }
  }

  export default Snack;