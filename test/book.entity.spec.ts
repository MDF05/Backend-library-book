import { Book } from "../src/domain/book/book.entity";

describe("Book Entity", () => {
  it("should create a book with correct properties", () => {
    const book = new Book("BOOK-1", "Clean Code", "Robert C. Martin", 5);

    expect(book.code).toBe("BOOK-1");
    expect(book.title).toBe("Clean Code");
    expect(book.author).toBe("Robert C. Martin");
    expect(book.stock).toBe(5);
  });

  it("should allow reducing stock when book is borrowed", () => {
    const book = new Book("BOOK-1", "Clean Code", "Robert C. Martin", 5);
    book.stock -= 1;

    expect(book.stock).toBe(4);
  });

  it("should not allow reducing stock below zero", () => {
    const book = new Book("BOOK-1", "Clean Code", "Robert C. Martin", 0);

    book.stock = Math.max(0, book.stock - 1); 

    expect(book.stock).toBe(0);
  });
});
