import joi from 'joi'

export const updateInfo=joi.object({
        email:joi.string().optional(),
        password:joi.string().optional(),
        firstName:joi.string().optional(),
        lastName:joi.string().optional()
})