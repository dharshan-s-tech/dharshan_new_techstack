import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        try {
          const res = await fetch('http://127.0.0.1:8000/api/admin/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password
            })
          });

          if (!res.ok) return null;
          const user = await res.json();
          return user;
        } catch (e) {
          console.error('NextAuth authorize error:', e);
          return null;
        }
      }
    })
  ]
});

export { handler as GET, handler as POST };
