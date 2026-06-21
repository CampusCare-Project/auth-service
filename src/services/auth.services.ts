import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { generateToken,verifyToken } from '../utils/jwt';



export class AuthService {

  static async getUsers() {
    return prisma.user.findMany({
    orderBy:{createdAt:'desc'},
    });
  }

  static async getUsersById(id:string) {
    return prisma.user.findMany({
    where:{id_user:id},
     select: {
      id_user: true,
      username: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      avatarMediaId: true,
      identityNumber: true,
      department: true,
      createdAt: true,
      updatedAt: true,
    },
    });
  }

   static async getUsersTech() {
    return prisma.user.findMany({
    orderBy:{createdAt:'desc'},
    where:{role:"TECHNICIAN"},
    });
  }

  static async register(data: {
    username: string;
    name: string;
    email:string;
    passwordHash: string;
  }) {
          return prisma.$transaction(async(tx:any) => {
            const username = await tx.user.findunique({
              where:{username:data.username}
            })
        if(username){throw new Error(`username ${username} sudah ada, coba yang lain` )}

            const {passwordHash} = data;
             const hashed = await bcrypt.hash(passwordHash, 10);
        const created = await tx.user.create(
          {data:{...data,passwordHash:hashed, role:"ADMIN"}}
        )
        return created;
      });
    }

 
static async addUsers(data: {
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}) {
  return prisma.$transaction(async (tx: any) => {
    const existingUsername = await tx.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new Error(`Username ${data.username} sudah ada, coba yang lain`);
    }

    const existingEmail = await tx.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error(`Email ${data.email} sudah ada, coba yang lain`);
    }

    if (data.role === "ADMIN") {
      throw new Error("User dengan role ADMIN tidak bisa ditambahkan lewat endpoint ini");
    }

    const allowedRoles = ["STUDENT", "STAFF", "TECHNICIAN"];

    if (!allowedRoles.includes(data.role)) {
      throw new Error("Role tidak valid");
    }

    const hashed = await bcrypt.hash(data.passwordHash, 10);

    const created = await tx.user.create({
      data: {
        username: data.username,
        name: data.name,
        email: data.email,
        passwordHash: hashed,
        role: data.role,
      },
    });

    const { passwordHash: _, ...safeUser } = created;

    return safeUser;
  });
}
    
  static async login(data: {
    identifier: string; // username 
    password: string;
  }) {
    const { identifier, password } = data;

    // cari user by username ATAU email // gak jade
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier },{name:identifier},{email:identifier}], //in case something added
      },
    });

    if (!user) throw new Error('user tidak ditemukan ' + identifier);
    
    // cek password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match || !user) throw new Error('Password/Username salah');

    // token
    const token = await generateToken(
      {
        id: user.id_user,
        username: user.username,
        name: user.name,
        role:user.role
      },
      Number(process.env.TokenExpired) // expired in 1 hour based on ENV
    );
    // console.log("TOKEN:", token);

// console.log("TEST VERIFY:", await verifyToken(token));
const { passwordHash: _, ...safeUser } = user;
return { user: safeUser, token };
  }
  static async logout(token: string) {
  const decoded: any = await verifyToken(token);

  await prisma.blacklistedToken.create({
    data: {
      token,
      expiredAt: new Date(decoded.exp * 1000),
    },
  });

  return true;
}

static async verifySession(token: string) {
  const decoded: any = await verifyToken(token);

  const blacklisted = await prisma.blacklistedToken.findUnique({
    where: { token },
  });

  if (blacklisted) {
    throw new Error("Token sudah logout / blacklisted");
  }

  const user = await prisma.user.findUnique({
    where: {
      id_user: decoded.id,
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User tidak aktif");
  }

  const { passwordHash: _, ...safeUser } = user;

  return safeUser;
}

}
