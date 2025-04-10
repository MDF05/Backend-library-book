import { Request, Response } from "express";
import { MemberRepository } from "../../infrastructure/repositories/member.repository";

const memberRepo = new MemberRepository();

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await memberRepo.findAll();
    const memberData = members.map((member) => ({
      id: member.id,
      name: member.name,
      borrowedBooks: member.borrowedBooks.length, // Menghitung jumlah buku yang dipinjam
    }));
    res.status(200).json(memberData);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving members", error });
  }
};
