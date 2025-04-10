export class Book {
  constructor(
    public code: string,
    public title: string,
    public author: string,
    public stock: number
  ) {}

  isAvailable(): boolean {
    return this.stock > 0;
  }

  borrow(): boolean {
    if (!this.isAvailable()) return false;
    this.stock--;
    return true;
  }

  return(): void {
    this.stock++;
  }
}
