import { Request, Response } from "express";
import { MemberRepository } from "../../infrastructure/repositories/member.repository";

const memberRepo = new MemberRepository();

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await memberRepo.findAll(); // You'll need to implement this in your repo
    const memberData = members.map((member) => ({
      id: member.id,
      name: member.name,
      borrowedBooks: member.borrowedBooks.length,
    }));
    res.status(200).json(memberData);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving members", error });
  }
};
