export class ShoppingListItem {
  private MAX = 3;
  private COLORS = [
    {
      bg: "#FFF9C4",
      text: "#795548",
    },
    {
      bg: "#FFECB3",
      text: "#6D4C41",
    },
    {
      bg: "#B3E5FC",
      text: "#01579B",
    },
  ];

  public id: string;
  public name: string;
  public quantity: number;
  public day: Date;
  public random: number;
  public quantityUnitEn: string;
  public quantityUnitHu: string;
  public quantityUnit: string;

  constructor(
    id: string,
    name: string,
    quantity: number,
    day: Date,
    quantityUnitEn: string,
    quantityUnitHu: string,
    quantityUnit: string,
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.day = day;
    this.quantityUnitEn = quantityUnitEn;
    this.quantityUnitHu = quantityUnitHu;
    this.quantityUnit = quantityUnit;

    this.random = Math.random();
  }

  public getPosition(): string {
    const maximumFive = Math.floor(this.random * this.MAX);
    return `${this.random < 0.5 ? "-" : "+"}${maximumFive}deg`;
  }

  public getColors(): { bg: string; text: string } {
    const randomColor = Math.floor(this.random * this.COLORS.length);
    return this.COLORS[randomColor];
  }
}
