import joi from 'joi'
export const adminAddUser=joi.object({
    email:joi.string().required(),
    password:joi.string().required(),
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    role:joi.string().optional(),
    profilePic:joi.optional()
})

export const AdminupdateInfo=joi.object({
        email:joi.string().optional(),
        password:joi.string().optional(),
        firstName:joi.string().optional(),
        lastName:joi.string().optional()
})

export const AddPostSchema=joi.object({
    title:joi.string().required(),
    content:joi.string().required(),
    imageUrl:joi.string().optional(),
    main_image: joi.string().optional()
})

export const EditPostSchema=joi.object({
    title:joi.string().optional(),
    content:joi.string().optional(),
    imageUrl:joi.string().optional(),
    main_image: joi.string().optional()
})