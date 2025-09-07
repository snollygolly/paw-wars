"use strict";

// Simple in-memory session store for koa-session
// Note: Suitable for development or single-process deployments.
// For production, consider a persistent store (e.g., Redis or MongoDB).

const store = new Map();

module.exports = {
  // Get session by key
  get: async (key) => {
    return store.get(key);
  },

  // Set session by key
  set: async (key, sess, maxAge, { rolling, changed } = {}) => {
    store.set(key, sess);
  },

  // Destroy session by key
  destroy: async (key) => {
    store.delete(key);
  }
};

