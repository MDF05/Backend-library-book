import { BookRepository } from "../infrastructure/repositories/book.repository";
import { MemberRepository } from "../infrastructure/repositories/member.repository";
import { Book } from "../domain/book/book.entity";
import { Member } from "../domain/member/member.entity";

export class BorrowService {
  constructor(
    private bookRepository: BookRepository,
    private memberRepository: MemberRepository
  ) {}

  async borrow(memberId: string, bookCode: string) {
    const member = await this.memberRepository.findById(memberId);
    const book = await this.bookRepository.getByCode(bookCode);

    if (!member || !book) {
      return { success: false, message: "Member or Book not found" };
    }

    if (!member.canBorrow()) {
      return {
        success: false,
        message: "Member has already borrowed the maximum number of books",
      };
    }

    if (book.stock <= 0) {
      return { success: false, message: "No stock available for this book" };
    }

    // Borrow the book
    member.borrowedBooks.push({
      code: book.code,
      borrowedAt: new Date(),
    });

    book.stock -= 1;

    await this.bookRepository.updateStock(book.code, book.stock);
    await this.memberRepository.save(member);

    return { success: true, message: "Book borrowed successfully" };
  }

  async return(memberId: string, bookCode: string) {
    const member = await this.memberRepository.findById(memberId);
    const book = await this.bookRepository.getByCode(bookCode);

    if (!member || !book) {
      return { success: false, message: "Member or Book not found" };
    }

    const borrowedBookIndex = member.borrowedBooks.findIndex(
      (b) => b.code === bookCode
    );
    if (borrowedBookIndex === -1) {
      return {
        success: false,
        message: "This book was not borrowed by the member",
      };
    }

    member.borrowedBooks.splice(borrowedBookIndex, 1);

    // Update book stock
    book.stock += 1;
    await this.bookRepository.updateStock(book.code, book.stock);

    // Add penalty if more than 7 days
    const borrowedAt = member.borrowedBooks[borrowedBookIndex].borrowedAt;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - borrowedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays > 7) {
      return { success: false, message: "Member is penalized for late return" };
    }

    await this.memberRepository.save(member);
    return { success: true, message: "Book returned successfully" };
  }
}
