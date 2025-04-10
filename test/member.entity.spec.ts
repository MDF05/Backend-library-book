
import { Member } from "../src/domain/member/member.entity";

describe("Member Entity", () => {
  it("should allow borrowing if no penalty and less than 2 books", () => {
    const member = new Member("123", "John Doe");
    expect(member.canBorrow()).toBe(true);
  });

  it("should not allow borrowing if already borrowed 2 books", () => {
    const member = new Member("123", "John Doe", [
      { code: "BOOK-1", borrowedAt: new Date() },
      { code: "BOOK-2", borrowedAt: new Date() },
    ]);
    expect(member.canBorrow()).toBe(false);
  });

  it("should return with penalty if returned after 7 days", () => {
    const borrowDate = new Date();
    borrowDate.setDate(borrowDate.getDate() - 10); 

    const member = new Member("123", "John Doe", [
      { code: "BOOK-1", borrowedAt: borrowDate },
    ]);

    const returnDate = new Date();
    const result = member.returnBook("BOOK-1", returnDate);

    expect(result).toBe(true);
    expect(member.penalized).toBe(true);
    expect(member.penaltyUntil).toBeTruthy();
  });

  it("should return without penalty if returned within 7 days", () => {
    const borrowDate = new Date();
    borrowDate.setDate(borrowDate.getDate() - 5); 

    const member = new Member("123", "John Doe", [
      { code: "BOOK-1", borrowedAt: borrowDate },
    ]);

    const returnDate = new Date();
    const result = member.returnBook("BOOK-1", returnDate);

    expect(result).toBe(true);
    expect(member.penalized).toBe(false);
    expect(member.penaltyUntil).toBe(null);
  });

  it("should not return a book that was not borrowed", () => {
    const member = new Member("123", "John Doe");
    const result = member.returnBook("NON-EXISTENT", new Date());
    expect(result).toBe(false);
  });

  it("should allow borrowing again after penalty expired", () => {
    const member = new Member("123", "John Doe");
    const now = new Date();

    
    member.penaltyUntil = new Date(now.getTime() - 1000); 

    expect(member.penalized).toBe(false);
    expect(member.canBorrow()).toBe(true);
  });

  it("should not allow borrowing if still in penalty period", () => {
    const member = new Member("123", "John Doe");
    const now = new Date();

    
    member.penaltyUntil = new Date(now.getTime() + 1000 * 60); 

    expect(member.penalized).toBe(true);
    expect(member.canBorrow()).toBe(false);
  });
});
