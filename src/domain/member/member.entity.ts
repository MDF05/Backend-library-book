export class BorrowedBook {
  constructor(public code: string, public borrowedAt: Date) {}
}

export class Member {
  constructor(
    public id: string,
    public name: string,
    public borrowedBooks: BorrowedBook[] = [],
    public penaltyUntil: Date | null = null
  ) {}

  canBorrow(): boolean {
    const now = new Date();
    return (
      (!this.penaltyUntil || now >= this.penaltyUntil) &&
      this.borrowedBooks.length < 2
    );
  }

  borrowBook(bookCode: string): string | null {
    if (!this.canBorrow())
      return "Cannot borrow: either penalized or reached limit";
    if (this.borrowedBooks.some((b) => b.code === bookCode))
      return "Already borrowed this book";

    this.borrowedBooks.push(new BorrowedBook(bookCode, new Date()));
    return null;
  }

  returnBook(bookCode: string): { message: string; penalized: boolean } | null {
    const borrowed = this.borrowedBooks.find((b) => b.code === bookCode);
    if (!borrowed) return null;

    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - borrowed.borrowedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    this.borrowedBooks = this.borrowedBooks.filter((b) => b.code !== bookCode);

    if (diffDays > 7) {
      const penalty = new Date();
      penalty.setDate(penalty.getDate() + 3);
      this.penaltyUntil = penalty;
      return { message: "Returned late, penalized", penalized: true };
    }

    return { message: "Returned successfully", penalized: false };
  }
}
