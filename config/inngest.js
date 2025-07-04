import { Inngest } from "inngest";
import connectdb from "./db";
import User from "@/model/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quick-commerce" });

// Inngest function to save user data to a database 
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {event: 'clerk/user.created'},
    async ({event}) => {        
        const {id,first_name,last_name, email_address, image_url } = event.data
        const user_data = {
            _id:id,
            email:email_address[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url

        }
        await connectdb()
        await User.create(user_data)
    }
) 

// Inngest function to update user data to database..
export const syncUserUpdation = inngest.createFunction(
    {
        id:'update-user-from-clerk'
    },
    {event:'clerk/user.updated'},
    async ({event}) => {
        const {id,first_name,last_name, email_address, image_url } = event.data
        const user_data = {
            _id:id,
            email:email_address[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url

        }
        await connectdb()
        await User.findByIdAndUpdate(id, user_data)
    }
)

// Inngest function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {event: 'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data

        await connectdb()
        await User.findByIdAndUpdate(id)
    }
)