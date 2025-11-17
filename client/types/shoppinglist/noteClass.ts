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

  public id: number;
  public name: string;
  public quantity: number;
  public metric: string;
  public day: Date;
  public random: number;

  constructor(
    id: number,
    name: string,
    quantity: number,
    metric: string,
    day: Date
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.metric = metric;
    this.day = day;

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
