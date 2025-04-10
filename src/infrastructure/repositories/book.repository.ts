
import { Book } from "../../domain/book/book.entity";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export class BookRepository {
  async getAll(): Promise<Book[]> {
    const books = await prisma.book.findMany();
    return books.map((b) => new Book(b.code, b.title, b.author, b.stock));
  }

  async getByCode(code: string): Promise<Book | null> {
    const book = await prisma.book.findUnique({
      where: { code },
    });
    return book
      ? new Book(book.code, book.title, book.author, book.stock)
      : null;
  }

  async updateStock(code: string, stock: number): Promise<Book | null> {
    const updatedBook = await prisma.book.update({
      where: { code },
      data: { stock },
    });
    return new Book(
      updatedBook.code,
      updatedBook.title,
      updatedBook.author,
      updatedBook.stock
    );
  }
}
