import { Book } from "../src/domain/book/book.entity";

describe("Book Entity", () => {
  it("should decrease stock when borrowed", () => {
    const book = new Book("CODE-1", "Test Book", "Author", 1);
    expect(book.borrow()).toBe(true);
    expect(book.stock).toBe(0);
  });

  it("should not borrow if stock is 0", () => {
    const book = new Book("CODE-2", "Another Book", "Author", 0);
    expect(book.borrow()).toBe(false);
  });

  it("should increase stock when returned", () => {
    const book = new Book("CODE-3", "Return Book", "Author", 0);
    book.return();
    expect(book.stock).toBe(1);
  });
});
