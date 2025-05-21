import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import { PrismaClient } from "@prisma/client";

const generateUniqueUsername = async (baseUsername, prisma) => {
  let username = baseUsername.replace(/\s/g, "").toLowerCase();
  let suffix = 1;
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${baseUsername.replace(/\s/g, "").toLowerCase()}${suffix}`;
    suffix++;
  }
  return username;
};

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${
        process.env.SERVER_URL || "http://localhost:5000"
      }/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { oauth_id: profile.id },
          include: { role: true },
        });

        if (!user) {
          console.log("Creating new Google user:", profile.emails[0].value); // Add logging
          user = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              username: await generateUniqueUsername(
                profile.displayName,
                prisma
              ),
              full_name: profile.displayName,
              oauth_provider: "google",
              oauth_id: profile.id,
              role: { connect: { role_id: 2 } },
            },
            include: { role: true }, // Add this
          });
        } else {
          console.log("Existing Google user:", user.email); // Add logging
        }

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${
        process.env.SERVER_URL || "http://localhost:5000"
      }/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { oauth_id: profile.id },
          include: { role: true },
        });

        if (!user) {
          // Safe email access
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : `${profile.username.toLowerCase()}@placeholder.com`;

          console.log("Creating new GitHub user:", email); // Fixed logging

          user = await prisma.user.create({
            data: {
              email: email,
              username: await generateUniqueUsername(profile.username, prisma),
              full_name: profile.displayName || profile.username,
              oauth_provider: "github",
              oauth_id: profile.id,
              role: { connect: { role_id: 2 } },
            },
            include: { role: true },
          });
        } else {
          console.log("Existing GitHub user:", user.email);
        }

        return done(null, user);
      } catch (error) {
        console.error("GitHub OAuth error:", error);
        return done(error, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: { role: true },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
