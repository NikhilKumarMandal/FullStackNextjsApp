import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"


export const authOptions: NextAuthOptions = {

    providers: [
        CredentialsProvider({
            name: "Credentials",
            id: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any> {
                try {
                    await dbConnect()
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if (!user) {
                        throw new Error('No user found with this email');
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)

                    if (isPasswordCorrect) {
                        return user
                    }else{
                        throw new Error('Incorrect password');
                    }
                    
                } catch (err: any) {
                    throw new Error(err)
                }
              }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            if (user) {
                token._id= user._id;
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.isAcceptingMessages = token.isAcceptingMessages
            
            }
            return session
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}