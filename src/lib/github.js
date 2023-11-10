import { PUBLIC_GITHUB_TOKEN } from "$env/static/public";

const token = PUBLIC_GITHUB_TOKEN;
const authParams = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

/** @param {string} username */
export const getUser = async (username) => {
  const resp = await fetch(
    `https://api.github.com/users/${username}`,
    authParams
  );
  const data = await resp.json();

  return data;
};

/** @param {string} username */
export const getUserFollowers = async (username) => {
  const resp = await fetch(
    `https://api.github.com/users/${username}/followers`,
    authParams
  );
  const data = await resp.json();

  return data;
};

/** @param {string} username */
export const getUserFollowing = async (username) => {
  const resp = await fetch(
    `https://api.github.com/users/${username}/following`,
    authParams
  );
  const data = await resp.json();

  return data;
};
