
export const UserRole = {
  USER: 1,
  MANAGER: 2,
  ADMINISTRATOR: 3
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];