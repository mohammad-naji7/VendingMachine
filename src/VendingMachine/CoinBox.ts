import MoneySlot from "./MoneySlot";
import CashCurrency from './CashCurrency';

const defaultCoinCurrencies: CashCurrency[] = [
  new CashCurrency('10C', .1, 'Coin', 0),
  new CashCurrency('20C', .2, 'Coin', 0),
  new CashCurrency('50C', .5, 'Coin', 0),
  new CashCurrency('$1', 1, 'Coin', 0),
]

class CoinBox implements MoneySlot {
  constructor(
    private _coinCurrencies: CashCurrency[] = [...defaultCoinCurrencies]
  ) {}

  addCoinCurrency(newCoin: CashCurrency): void {
    let didPass: boolean = false
    this._coinCurrencies = this._coinCurrencies.map(coin => {
      if(coin.label === newCoin.label){
        didPass= true;
        return new CashCurrency(coin.label, coin.value, coin.type, coin.count + newCoin.count)
      }
      return coin;
    })

    if(!didPass){
      throw Error('The passed coin is not supported in the box');
    }
  }

  dispenseCoin(dispensedCoin: CashCurrency): void {
    let didPass: boolean = false
    this._coinCurrencies = this._coinCurrencies.map(coin => {
      if(coin.label === dispensedCoin.label){
        didPass= true;
        return new CashCurrency(coin.label, coin.value, coin.type, coin.count - dispensedCoin.count)
      }
      return coin;
    })

    if(!didPass){
      throw Error('The passed coin is not supported in the box');
    }
  }

  get coinCurrencies(): CashCurrency[] {
    return this._coinCurrencies
  }

  getBalance(): number {
    return this._coinCurrencies.reduce((sum, coin) => sum += (coin.count * coin.value), 0);
  }

  reset(): void {
    this._coinCurrencies.forEach(coin => {
      coin.count = 0
    })
  }
}

export default CoinBox;
