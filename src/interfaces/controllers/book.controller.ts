import { Request, Response } from "express";
import { BookRepository } from "../../infrastructure/repositories/book.repository";

const bookRepo = new BookRepository();

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookRepo.getAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
};
