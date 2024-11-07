import bcrypt from 'bcryptjs';
import * as db from './db';

const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

export async function login(username: string, password: string) {
  const user = await db.getUsuarioByUsername(username);

  if (!user) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  // Check if user is blocked
  if (user.bloqueado_hasta && new Date(user.bloqueado_hasta).getTime() > Date.now()) {
    throw new Error('Usuario bloqueado temporalmente');
  }

  // Verify password
  if (!bcrypt.compareSync(password, user.password)) {
    const intentos = user.intentos_fallidos + 1;
    let bloqueadoHasta = null;

    if (intentos >= MAX_LOGIN_ATTEMPTS) {
      bloqueadoHasta = new Date(Date.now() + BLOCK_DURATION).toISOString();
    }

    await db.updateIntentosFallidos(username, intentos, bloqueadoHasta);
    throw new Error('Usuario o contraseña incorrectos');
  }

  // Reset failed attempts
  await db.updateIntentosFallidos(username, 0, null);

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function createUser(username: string, password: string, role: 'admin' | 'user') {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: crypto.randomUUID(),
    username,
    password: hashedPassword,
    nombre: username,
    tipo: 'empleado',
    rol: role,
    activo: true,
    fecha_inicio: new Date().toISOString()
  };

  await db.addUsuario(newUser);
}

export async function updateUser(userId: string, updates: any) {
  await db.updateUsuario({ id: userId, ...updates });
}

export async function deleteUser(userId: string) {
  await db.deleteUsuario(userId);
}

export async function getUsers() {
  return await db.getAllUsuarios();
}