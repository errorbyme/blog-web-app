import JWT from "jsonwebtoken";
const secret = "$#chintapakdamdam@999";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    fullname: user.fullname,
    pfp: user.pfp,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

export { validateToken, createTokenForUser };
