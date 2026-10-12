import { prisma } from "@/lib/prisma";
import ContactList from "./ContactList";

export default async function ContactsPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Contact Submissions</h1>
      <ContactList submissions={submissions} />
    </div>
  );
}