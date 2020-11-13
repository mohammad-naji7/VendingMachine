interface MoneySlot {
    /** returns the total money available in a slot in USD */
    getBalance: () => number;

    reset: () => void;
  }
  

  export default MoneySlot;