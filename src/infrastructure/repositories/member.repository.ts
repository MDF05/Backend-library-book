import { PrismaClient } from "@prisma/client";
import { Member, BorrowedBook } from "../../domain/member/member.entity";

const prisma = new PrismaClient();

export class MemberRepository {
  async findById(id: string): Promise<Member | null> {
    const member = await prisma.member.findUnique({
      where: { id },
      include: { borrowedBooks: true },
    });

    if (!member) return null;

    const borrowedBooks = member.borrowedBooks.map(
      (b) => new BorrowedBook(b.bookCode, b.borrowedAt)
    );

    return new Member(
      member.id,
      member.name,
      borrowedBooks,
      member.penaltyUntil
    );
  }

  async save(member: Member): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.member.update({
        where: { id: member.id },
        data: { penaltyUntil: member.penaltyUntil },
      });

      await tx.borrow.deleteMany({ where: { memberId: member.id } });

      await Promise.all(
        member.borrowedBooks.map((b) =>
          tx.borrow.create({
            data: {
              memberId: member.id,
              bookCode: b.code,
              borrowedAt: b.borrowedAt,
            },
          })
        )
      );
    });
  }

  async findAll(): Promise<Member[]> {
    const members = await prisma.member.findMany({
      include: { borrowedBooks: true },
    });

    return members.map((m) => new Member(m.id, m.name, m.borrowedBooks));
  }
}
