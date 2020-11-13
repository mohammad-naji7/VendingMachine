export type ItemType = "Snack" | "Drink" | "Coffee";
  
interface VMItem {
  brand: string;
  name: string;
  price: number;
  quantity: number;
  // we could a separate property for the item position in the VM,
  // but to keep it simple we are using the index
  // position: Position;
  type: ItemType;
}

export default VMItem;