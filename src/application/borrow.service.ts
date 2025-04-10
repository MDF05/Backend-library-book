import { BookRepository } from "../infrastructure/repositories/book.repository";
import { MemberRepository } from "../infrastructure/repositories/member.repository";

export class BorrowService {
  constructor(
    private bookRepo: BookRepository,
    private memberRepo: MemberRepository
  ) {}

  async borrow(memberId: string, bookCode: string) {
    const book = await this.bookRepo.findByCode(bookCode);
    const member = await this.memberRepo.findById(memberId);

    if (!book || !book.isAvailable())
      return { success: false, message: "Book not available" };
    if (!member) return { success: false, message: "Member not found" };

    const err = member.borrowBook(bookCode);
    if (err) return { success: false, message: err };

    book.borrow();
    await this.memberRepo.save(member);
    await this.bookRepo.save(book);

    return { success: true, message: "Book borrowed successfully" };
  }

  async return(memberId: string, bookCode: string) {
    const book = await this.bookRepo.findByCode(bookCode);
    const member = await this.memberRepo.findById(memberId);

    if (!book || !member)
      return { success: false, message: "Book or member not found" };

    const result = member.returnBook(bookCode);
    if (!result)
      return { success: false, message: "Book not borrowed by member" };

    book.return();
    await this.memberRepo.save(member);
    await this.bookRepo.save(book);

    return { success: true, message: result.message };
  }
}
