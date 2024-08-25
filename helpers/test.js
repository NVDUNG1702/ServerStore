
const expiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
console.log(expiresAt.toISOString().slice(0, 19).replace('T', ' '));