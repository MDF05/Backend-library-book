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

  it("should return with penalty if late", () => {
    const date = new Date();
    date.setDate(date.getDate() - 10); // Borrowed 10 days ago

    const member = new Member("123", "John Doe", [
      { code: "BOOK-1", borrowedAt: date },
    ]);
    const result = member.returnBook("BOOK-1");

    expect(result?.penalized).toBe(true);
    expect(member.penaltyUntil).toBeTruthy();
  });
});
