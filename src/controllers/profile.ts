import { Context } from 'koa';

// Returns the authenticated user's profile (id, role, username, email)
export const getProfile = async (ctx: Context) => {
  // ctx.state.user is set by auth middleware
  const user = ctx.state.user;
  ctx.body = {
    id: user.id,
    role: user.role,
    // Optionally, fetch more info from DB if needed
  };
};
