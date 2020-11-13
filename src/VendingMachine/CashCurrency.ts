
type Currency = 'USD'
type CurrencyType = 'Coin' | 'Note'
class CashCurrency {
    // from the specification Doc i am under the impression that i do not need to worry about the currency
    // but if we had to worry about it, we will have additional values and method to validate it
    constructor(private _label: string, private _value: number, private _type: CurrencyType, private _count: number, private _currency: Currency = 'USD'){}

    set count(val: number) {
        if(val >= 0){
            this._count = val
        }
        else {
            throw Error("Can not set property '_tenCent' to negative value")
        }
    }
    
    get label(): string {
        return this._label;
    }

    get value(): number {
        return this._value
    }
    
    get type(): CurrencyType {
        return this._type
    }

    get count(): number {
        return this._count;
    }
    
    get currency(): Currency {
        return this._currency
    }
}

export default CashCurrency;