import { PrismaClient } from "@prisma/client";
import { Book } from "../../domain/book/book.entity";

const prisma = new PrismaClient();

export class BookRepository {
  async findByCode(code: string): Promise<Book | null> {
    const book = await prisma.book.findUnique({ where: { code } });
    if (!book) return null;
    return new Book(book.code, book.title, book.author, book.stock);
  }

  async save(book: Book): Promise<void> {
    await prisma.book.update({
      where: { code: book.code },
      data: { stock: book.stock },
    });
  }

  async getAll(): Promise<Book[]> {
    const books = await prisma.book.findMany();
    return books.map((b) => new Book(b.code, b.title, b.author, b.stock));
  }
}
