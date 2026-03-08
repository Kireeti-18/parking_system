'use server';

import { Parkings } from '../../../../packages/db/generated/prisma';
import getSessionData from '../../components/server/getSessionData';
import prisma from '@parking/db';
import bcrypt from 'bcrypt';

export const updateUserInfo = async (data: {
  name?: string;
  avatar?: string;
}) => {
  const session = await getSessionData();
  const userId = session.userInfo?.user_id;

  if (!userId) return false;

  const updateData: {
    name?: string;
    avathar?: string;
  } = {};

  if (data.name) {
    updateData.name = data.name;
  }

  if (data.avatar) {
    updateData.avathar = data.avatar;
  }

  if (Object.keys(updateData).length === 0) {
    return false;
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return true;
  } catch (error) {
    console.error('Failed to update user:', error);
    return false;
  }
};

export const getUserBookedParkings = async (
  page: number = 1,
  status?: string,
): Promise<(Parkings & { parkingArea: { name: string } })[]> => {
  const session = await getSessionData();
  const userId = session.userInfo?.user_id;

  if (!userId) return [];

  const parkings = await prisma.parkings.findMany({
    where: {
      parked_user_id: userId,
      ...(status ? { status } : {}),
    },
    include: {
      parkingArea: {
        select: {
          name: true,
        },
      },
    },
    take: 5,
    skip: (page - 1) * 5,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return parkings;
};

export const updateUserSettings = async (data: {
  nearestCount: number;
  nearestDistance: number;
  notifications: boolean;
}) => {
  const session = await getSessionData();
  const userId = session.userInfo?.user_id;

  if (!userId) return false;

  const nearestCount = Math.min(10, Math.max(1, Number(data.nearestCount)));
  const nearestDistance = Math.min(
    500,
    Math.max(1, Number(data.nearestDistance)),
  );

  try {
    await prisma.setting.upsert({
      where: { user_id: userId },
      update: {
        nearest_count: nearestCount,
        nearest_distance: nearestDistance,
        notifications: Boolean(data.notifications),
      },
      create: {
        user_id: userId,
        nearest_count: nearestCount,
        nearest_distance: nearestDistance,
        notifications: Boolean(data.notifications),
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to update settings:', error);
    return false;
  }
};

export const changeUserPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const session = await getSessionData();
  const userId = session.userInfo?.user_id;

  if (!userId) {
    return { ok: false, error: 'Unauthorized user' };
  }

  const currentPassword = data.currentPassword?.trim() || '';
  const newPassword = data.newPassword?.trim() || '';

  if (!currentPassword || !newPassword) {
    return { ok: false, error: 'Current and new password are required' };
  }

  if (currentPassword === newPassword) {
    return {
      ok: false,
      error: 'New password must be different from current password',
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return { ok: false, error: 'User not found' };
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordCorrect) {
      return { ok: false, error: 'Current password is incorrect' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 7);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { ok: true };
  } catch (error) {
    console.error('Failed to change password:', error);
    return { ok: false, error: 'Failed to update password' };
  }
};
