import { Context } from 'hono';
import { AuthService } from '../services/auth.services';
import { registerSchema,addUsersSchema } from '../validation/auth.validation';


export class AuthController {

    static async getUsers(c: Context) {
    try {
      const data = await AuthService.getUsers();

      return c.json({
        success: true,
        data: data
      });

    } catch (error) {
      return c.json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }, 500);
    }
  }

   static async getUsersById(c: Context) {
    try {
      const id = c.req.param("id") as string;
      const data = await AuthService.getUsersById(id);

      return c.json({
        success: true,
        data: data
      });

    } catch (error) {
      return c.json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }, 500);
    }
  }

   static async getUsersTech(c: Context) {
    try {
      const data = await AuthService.getUsersTech();

      return c.json({
        success: true,
        data: data
      });

    } catch (error) {
      return c.json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }, 500);
    }
  }

  static async register(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = registerSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          {
            status: 'error',
            errors: parsed.error?.flatten().fieldErrors,
          },
          400
        );
      }
      const user = await AuthService.register(body);
      return c.json({ message: 'Register berhasil', user }, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  }

   static async addUsers(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = addUsersSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          {
            status: 'error',
            errors: parsed.error?.flatten().fieldErrors,
          },
          400
        );
      }
      const user = await AuthService.addUsers(body);
      return c.json({ message: 'Register berhasil', user }, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  }

  static async login(c: Context) {
    try {
      const body = await c.req.json();
      const result = await AuthService.login(body);
      return c.json({ message: 'Login berhasil', ...result });
      
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  }

static async logout(c: Context) {
  const auth = c.req.header('Authorization');

  if (!auth) return c.json({ error: 'Token tidak ada' }, 401);

  const token = auth.replace(/^Bearer\s+/i, '').trim();
  await AuthService.logout(token);
  
  return c.json({ message: 'Logout berhasil' });
}

  static async verify(c: Context) {
    try {
      const authHeader = c.req.header("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json(
          {
            success: false,
            message: "Authorization Bearer token wajib ada",
          },
          401
        );
      }

      const token = authHeader.replace("Bearer ", "");

      const user = await AuthService.verifySession(token);

      return c.json({
        success: true,
        message: "Token valid",
        data: {
          user,
        },
      });
    } catch (error: any) {
      return c.json(
        {
          success: false,
          message: error.message || "Token tidak valid",
        },
        401
      );
    }
  }
}