import Position from './Position'

class Keypad {
    constructor(
      // some vending machines might not have a full keypad based on it is size (how much rows, and how much items per row)
      // also i think i would be more scalable to have it as string to support bigger sizes
      // but to keep simple will use number (also the Doc specifies it as number)  
      public selectionKeys: number[] = [0, 1, 2, 3, 4],
      public currentSelection: Position | null = null
    ) {}

    resetSelection(): void {
      this.currentSelection?.reset();
    }
  }

  export default Keypad;