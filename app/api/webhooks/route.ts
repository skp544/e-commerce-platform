import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { User } from "@/lib/generated/prisma";
import db from "@/lib/db";
import {   clerkClient } from "@clerk/nextjs/server";


export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req);
    // const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    
    
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );
    

    if (evt.type === "user.created" || evt.type === "user.updated") {
      console.log("userId:", evt.data.id);

      const user: Partial<User> = {
        id: evt.data.id,
        name: `${evt.data.first_name} ${evt.data.last_name || ""}`,
        email: evt.data.email_addresses[0].email_address,
        picture: evt.data.image_url,
      };

      console.log("user:", user);

      if (!user) {
        return;
      }

      const dbUser = await db.user.upsert({
        where: { email: user.email },
        update: user,
        create: {
          id: user.id!,
          name: user.name!,
          email: user.email!,
          picture: user.picture!,
          role: user.role || "USER",
        },
      });
      
      
      const client = await clerkClient()
      
      await client.users.updateUserMetadata(evt.data.id, {
        privateMetadata: {
          role: dbUser.role || "USER"
        }
      })
      // await clerkClient.users.updateUserMetadata(evt.data.id, {})
    }
    
    if (evt.type === "user.deleted") {
      const userId = evt.data.id;
      
      await db.user.delete({where:{id: userId}});
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
