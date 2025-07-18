import { comparePassword, generateToken } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

// Hardcoded admin user (in production, this should be in the database)
const ADMIN_USER = {
  email: 'markhamrestring@gmail.com',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
  id: 'admin-1'
};

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user exists and password matches
    if (email !== ADMIN_USER.email) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await comparePassword(password, ADMIN_USER.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken(ADMIN_USER.id);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: ADMIN_USER.id,
        email: ADMIN_USER.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 