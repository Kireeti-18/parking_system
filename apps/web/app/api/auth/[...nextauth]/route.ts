import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@parking/db';
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials) return null;
        const { email, password } = credentials;
        try {
          const user = await prisma.user.findFirst({
            where: { email, verification_status: true },
          });
          if (!user) return null;

          const match = await bcrypt.compare(password, user.password);
          if (!match) return null;

          let userType = user.user_type;

          const sessionData: any = {
            user_id: user.id,
            name: user.name,
            email: user.email,
            user_type: userType,
            avathar: user.avathar,
          };

          if (user.user_type === 'admin') {
            const parking_areas = await prisma.parkingAreaStaff.findMany({
              where: {
                user_id: user.id,
                parkingArea: {
                  verification_status: true,
                },
              },
              include: { parkingArea: true },
              orderBy: {
                parkingArea: {
                  createdAt: 'asc',
                },
              },
            });
            if (parking_areas.length > 0) {
              const parkingData = parking_areas.map((p) => {
                const parkingArea = p.parkingArea;
                return {
                  parking_area_id: parkingArea.id,
                  parking_area_name: parkingArea.name,
                  parking_location: parkingArea.parking_location,
                  total_slots: parkingArea.bike_slots + parkingArea.car_slots,
                  bike_slots: parkingArea.bike_slots,
                  car_slots: parkingArea.car_slots,
                  is_opened: parkingArea.is_opened,
                  pricing_type: parkingArea.pricing_type,
                  car_price_per_hour: parkingArea.car_price_per_hour,
                  bike_price_per_hour: parkingArea.bike_price_per_hour,
                  total_revenue:
                    Number(parkingArea.car_price_per_hour) * 10 +
                    Number(parkingArea.bike_price_per_hour) * 5,
                  other_parking_info: parkingArea.meta_data,
                };
              });
              sessionData.parking_info = {
                parking_data: parkingData,
                current_parking_index: 0,
              };
            } else {
              userType = 'user';
              sessionData.user_type = userType;
            }
          }
          return sessionData;
        } catch (e) {
          console.error('Authorize error:', e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/(auth)/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token = {
          ...token,
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          user_type: user.user_type,
          avathar: user.avathar,
        };
        if (user.parking_info) {
          token.parking_info = {
            parking_data: user.parking_info.parking_data ?? [],
            current_parking_index: user.parking_info.current_parking_index ?? 0,
          };
        }
      }
      if (trigger === 'update') {
        const isAdmin = token.user_type === 'admin';
        if (isAdmin) {
          if (session?.current_parking_index !== undefined) {
            token = {
              ...token,
              ...(isAdmin
                ? {
                    parking_info: {
                      ...(token.parking_info ?? {}),
                      current_parking_index:
                        session?.current_parking_index ?? 0,
                    },
                  }
                : {}),
            };
          }

          if (
            session?.parking_status !== undefined &&
            session?.parking_id !== undefined
          ) {
            token = {
              ...token,
              ...(isAdmin
                ? {
                    parking_info: {
                      ...(token.parking_info ?? {}),
                      parking_data: (
                        token.parking_info?.parking_data || []
                      ).map((p) => {
                        if (p.parking_area_id !== session?.parking_id) return p;
                        return {
                          ...p,
                          is_opened: session?.parking_status,
                        };
                      }),
                    },
                  }
                : {}),
            };
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        name: token.name ?? session.user?.name ?? null,
        email: token.email ?? session.user?.email ?? null,
        user_id: token.user_id ?? undefined,
        user_type: token.user_type ?? undefined,
        avathar: token.avathar ?? null,
      };
      if (token.user_type === 'admin') {
        session.parking_info = {
          parking_data: token?.parking_info?.parking_data ?? [],
          current_parking_index:
            token?.parking_info?.current_parking_index ?? 0,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
