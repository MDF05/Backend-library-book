import { Request, Response } from "express";
import { BorrowService } from "../../application/borrow.service";
import { BookRepository } from "../../infrastructure/repositories/book.repository";
import { MemberRepository } from "../../infrastructure/repositories/member.repository";

const borrowService = new BorrowService(
  new BookRepository(),
  new MemberRepository()
);

export const borrowBook = async (req: Request, res: Response) => {
  const { memberId, bookCode } = req.body;

  try {
    const result = await borrowService.borrow(memberId, bookCode);
    res.status(result.success ? 200 : 400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Error borrowing book", error });
  }
};


export const returnBook = async (req: Request, res: Response) => {
  const { memberId, bookCode } = req.body;

  try {
    const result = await borrowService.return(memberId, bookCode);
    res.status(result.success ? 200 : 400).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Error returning book", error });
  }
};
