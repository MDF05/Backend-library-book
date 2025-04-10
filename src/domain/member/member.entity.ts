// src/domain/member/member.entity.ts

export class BorrowedBook {
  constructor(public code: string, public borrowedAt: Date) {}
}

const MAX_BORROW_DAYS = 7;
const PENALTY_DAYS = 3;

export class Member {
  borrowedBooks: BorrowedBook[] = [];
  penaltyUntil: Date | null = null;

  constructor(
    public id: string,
    public name: string,
    borrowedBooks: { code: string; borrowedAt: Date }[] = []
  ) {
    this.borrowedBooks = borrowedBooks.map(
      (book) => new BorrowedBook(book.code, book.borrowedAt)
    );
  }

  get penalized(): boolean {
    if (!this.penaltyUntil) return false;
    return this.penaltyUntil.getTime() > Date.now();
  }

  canBorrow(): boolean {
    return this.borrowedBooks.length < 2 && !this.penalized;
  }

  returnBook(bookCode: string, returnedAt: Date = new Date()): boolean {
    const borrowedBook = this.borrowedBooks.find((b) => b.code === bookCode);
    if (!borrowedBook) return false;

    const borrowDate = borrowedBook.borrowedAt;
    const diffInDays = Math.floor(
      (returnedAt.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays > MAX_BORROW_DAYS) {
      this.penaltyUntil = new Date(
        returnedAt.getTime() + PENALTY_DAYS * 24 * 60 * 60 * 1000
      );
    }

    this.borrowedBooks = this.borrowedBooks.filter((b) => b.code !== bookCode);
    return true;
  }
}
