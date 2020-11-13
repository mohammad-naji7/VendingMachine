import MoneySlot from './MoneySlot';

class CardSlot implements MoneySlot {
    constructor(
      private type: "Master Card" | "Visa Card" | null = null,
      private balance: number = 0
    ) {}
  
    getBalance(): number {
      return this.balance;
    }

    reset(): void {
      this.type = null;
      this.balance = 0;
    }
  }

  export default CardSlot;