import joi from 'joi'

export const expertchemaCreate=joi.object({
    name:joi.string().required(),
    email:joi.string().required(),
    password:joi.string().required(),
    profileFilePath:joi.string().optional(),
    main_image:joi.string().optional()
})


export const loginschemaCreate=joi.object({
    email:joi.string().required(),
    password:joi.string().required()
})