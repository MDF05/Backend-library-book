import { PrismaClient } from "@prisma/client";
import { Member, BorrowedBook } from "../../domain/member/member.entity";

const prisma = new PrismaClient();

export class MemberRepository {
  async findAll(): Promise<Member[]> {
    const members = await prisma.member.findMany({
      include: {
        borrowedBooks: {
          include: {
            book: true, // Mengambil data buku yang dipinjam
          },
        },
      },
    });

    return members.map(
      (m) =>
        new Member(
          m.id,
          m.name,
          m.borrowedBooks.map((b) => ({
            code: b.book.code,
            borrowedAt: b.borrowedAt,
          }))
        )
    );
  }

  async findById(id: string): Promise<Member | null> {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        borrowedBooks: {
          include: {
            book: true, // Mengambil data buku yang dipinjam
          },
        },
      },
    });

    return member
      ? new Member(
          member.id,
          member.name,
          member.borrowedBooks.map((b) => ({
            code: b.book.code,
            borrowedAt: b.borrowedAt,
          }))
        )
      : null;
  }

  async save(member: Member): Promise<Member> {
    const savedMember = await prisma.member.create({
      data: {
        name: member.name,
        borrowedBooks: {
          create: member.borrowedBooks.map((book) => ({
            borrowedAt: book.borrowedAt,
            book: {
              connect: { code: book.code }, // Menghubungkan buku berdasarkan kode
            },
          })),
        },
      },
      include: {
        borrowedBooks: {
          include: {
            book: true,
          },
        },
      },
    });

    return new Member(
      savedMember.id,
      savedMember.name,
      savedMember.borrowedBooks.map((b) => ({
        code: b.book.code,
        borrowedAt: b.borrowedAt,
      }))
    );
  }
}
