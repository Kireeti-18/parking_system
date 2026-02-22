'use server';

import prisma from '@parking/db';
import { getAvatharFromName } from '@parking/services';
import { isValidType, SignupType, UserTypeSet } from '@parking/validations';
import bcrypt from 'bcrypt';

export async function signupAction(body: SignupType) {
  let userType = 'user';
  let user = await prisma.user.findFirst({ where: { email: body.email } });
  let accessToken: any;
  if (body.user_type === 'admin_staff') {
    accessToken = await prisma.token.findFirst({
      where: { email: body.email, token_type: 'admin_staff_signup' },
    });

    if (!accessToken) {
      return { ok: false, error: 'Please contact admin for access token' };
    }

    userType = (accessToken.other_info || {})['user_type'] || '';

    if (!isValidType(UserTypeSet, userType)) {
      return {
        ok: false,
        error: 'Invalid User Type. contact admin',
      };
    }

    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
      user = null;
    }

    await prisma.token.delete({ where: { id: accessToken.id } });
  }

  if (user) {
    return { ok: false, error: 'User Already Exists' };
  }

  const hashedPassword = await bcrypt.hash(body.password, 7);

  const userAvathar = await getAvatharFromName(body.name);

  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashedPassword,
      avathar: userAvathar,
      verification_status: true,
      user_type: userType,
    },
  });

  if (body.user_type === 'admin_staff') {
    const parkingAreaId =
      (accessToken.other_info || {})['parking_area_id'] || '';

    const parkingArea = await prisma.parkingArea.findFirst({
      where: { id: parkingAreaId, verification_status: true },
    });

    if (parkingArea)
      await prisma.parkingAreaStaff.create({
        data: {
          user_id: newUser.id,
          parking_area_id: parkingAreaId,
          user_type: userType,
        },
      });
  }
  const user_info = {
    name: newUser.name,
    user_id: newUser.id,
    email: newUser.email,
    user_type: newUser.user_type,
    avathar: newUser.avathar,
  };

  return {
    ok: true,
    message: 'User created successfully',
    data: { user_info },
  };
}
