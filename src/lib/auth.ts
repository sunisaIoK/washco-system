import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"

//  login.getCollection("users") จะให้ reference ของ collection "users"
import firestore from "@/utils/database"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        console.log('email, password', email, password);


        if (!email || !password) {
          console.error("ไม่พบอีเมลหรือรหัสผ่าน");
          return null; // คืนค่า null หากไม่มีข้อมูลที่จำเป็น
        }

        try {
          const db = new firestore();
          const userCollection = db.getCollection("users");

          const snapshot = await userCollection.where("email", "==", email).limit(1).get();
          if (snapshot.empty) {
            console.error("ไม่พบผู้ใช้ที่มีอีเมลนี้ใน Firestore");
            return null; // คืนค่า null หากไม่พบผู้ใช้
          }

          const userDoc = snapshot.docs[0];
          const userData = userDoc.data();

          console.log("userData:", userData);


          if (!userData || !userData.hashedPassword) {
            console.error("ไม่มีฟิลด์ hashedPassword ใน Firestore");
            return null; // คืนค่า null หากไม่มีข้อมูลรหัสผ่านที่เข้ารหัส
          }

          const isMatch = await bcrypt.compare(password, userData.hashedPassword);
          if (!isMatch) {
            console.error("รหัสผ่านไม่ถูกต้อง");
            return null; // คืนค่า null หากรหัสผ่านไม่ตรงกัน
          }

          return {
            id: userDoc.id,
            email: userData.email,
            name: userData.name || "",
            role: userData.role || "user",
          }; // คืนค่าผู้ใช้หากทุกอย่างถูกต้อง
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้:", error);
          return null; // คืนค่า null หากเกิดข้อผิดพลาด
        }
      }

    }),
  ],

  // ตั้งค่าอื่นๆ ที่จำเป็น
  pages: {
    signIn: "/page/signin",   // ระบุเส้นทางหน้าล็อกอิน
  },
  session: {
    strategy: "jwt",          // ใช้ JWT
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // อย่าลืมตั้งใน .env
  },
  secret: process.env.NEXTAUTH_SECRET,

  // callback เมื่อ JWT ถูกสร้างหรืออัปเดต
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? "";
        token.name = user.name ?? "Unnamed";
        token.lastname = user.lastname;
        token.phone = user.phone;
        token.address = user.address;
        token.role = user.role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.lastname = token.lastname;
      session.user.phone = token.phone;
      session.user.address = token.address;
      session.user.role = token.role;
    
      return session;
    },
  },
}


export default NextAuth(authOptions)