import { BorrowService } from "../src/application/borrow.service";
import { Book } from "../src/domain/book/book.entity";
import { Member } from "../src/domain/member/member.entity";

describe("Borrow Service", () => {
  const bookRepoMock = {
    findByCode: jest.fn(),
    save: jest.fn(),
  };

  const memberRepoMock = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const service = new BorrowService(bookRepoMock as any, memberRepoMock as any);

  it("should allow member to borrow a book", async () => {
    const book = new Book("BK-1", "Book Title", "Author", 1);
    const member = new Member("M-1", "Alice");

    bookRepoMock.findByCode.mockResolvedValue(book);
    memberRepoMock.findById.mockResolvedValue(member);

    const result = await service.borrow("M-1", "BK-1");

    expect(result.success).toBe(true);
    expect(book.stock).toBe(0);
  });

  it("should not borrow if member already has the book", async () => {
    const member = new Member("M-2", "Bob", [
      { code: "BK-1", borrowedAt: new Date() },
    ]);
    const book = new Book("BK-1", "Book", "Author", 1);

    bookRepoMock.findByCode.mockResolvedValue(book);
    memberRepoMock.findById.mockResolvedValue(member);

    const result = await service.borrow("M-2", "BK-1");

    expect(result.success).toBe(false);
    expect(result.message).toContain("Already borrowed");
  });
});
