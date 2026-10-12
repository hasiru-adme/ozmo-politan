import "dotenv/config";
import { adminAuth } from "../lib/firebase-admin";
import { prisma } from "../lib/prisma";

async function createAdmin(email: string, password: string, name: string) {
  const userRecord = await adminAuth.createUser({ email, password, displayName: name });
  await adminAuth.setCustomUserClaims(userRecord.uid, { role: "ADMIN" });

  await prisma.user.create({
    data: { firebaseUid: userRecord.uid, email, name, role: "ADMIN" },
  });

  console.log("Admin created:", email);
}


createAdmin("janithmg@gmail.com", "%i%y>|qI]Pr)IRo?", "janith")
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });