class Position {
    constructor(public row: number | null = null, public column: number | null = null) {}

    reset(): void {
      this.row = null;
      this.column = null;
    }
  }

  export default Position;