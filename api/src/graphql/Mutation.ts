import {
    CollectionCreateManyWithoutOwnerInput,
    UserCreateOneWithoutCollectionsInput,
} from '@prisma/client'
import cuid from 'cuid'
import { schema } from 'nexus-future'
import { Context } from '../context'
import { getInitialSections } from '../data/new-user'
import { createNewItemFromSearch, inferNewItemFromUrl } from '../parsers'
import aws from 'aws-sdk'

interface Positonnable {
    position: number
}

export function reAssignPosition<T extends Positonnable>(
    array: T[],
    startIndex: number,
    endIndex: number
) {
    const result = Array.from(array)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result.flatMap((x, index) => {
        if (index === x.position) {
            return []
        } else {
            return {
                ...x,
                position: index,
            }
        }
    })
}

export const Mutation = schema.mutationType({
    definition(t) {
        t.crud.updateOneSection()
        t.crud.createOneUser()
        t.crud.updateOneUser()
        t.crud.updateOneItem()
        t.crud.updateOneCollection()
        t.field('signS3', {
            type: 'S3SignedPath',
            args: {
                fileName: schema.stringArg({ required: true }),
                fileType: schema.stringArg({ required: true }),
            },
            async resolve(_, { fileName, fileType }, ctx: Context) {
                const s3 = new aws.S3({
                    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
                    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
                    signatureVersion: 'v4',
                    region: 'eu-west-1',
                })
                const s3Bucket = 'tottem-media' // FIXME config
                const s3Params = {
                    Bucket: s3Bucket,
                    Key: fileName,
                    Expires: 60,
                    ContentType: 'multipart/form-data',
                    ACL: 'public-read',
                }

                const signedRequest = await s3.getSignedUrl(
                    'putObject',
                    s3Params
                )
                const url = `https://${s3Bucket}.s3.amazonaws.com/${fileName}`

                return {
                    signedRequest,
                    url,
                }
            },
        })

        t.field('createNewUser', {
            type: 'User',
            args: {
                slug: schema.stringArg({ required: true }),
                authUserId: schema.stringArg({ required: true }),
                pictureUrl: schema.stringArg({ required: true }),
                firstname: schema.stringArg({ required: true }),
            },
            async resolve(
                _,
                { slug, authUserId, pictureUrl, firstname },
                ctx: Context
            ) {
                return ctx.prisma.user.create({
                    data: {
                        firstname,
                        pictureUrl,
                        slug,
                        authUserId,
                        sections: getInitialSections(authUserId),
                    },
                })
            },
        })
        t.field('createEmptyCollection', {
            type: 'Collection',
            args: {
                sectionId: schema.idArg({ required: true }),
            },
            async resolve(_, { sectionId }, ctx: Context) {
                const user = await ctx.user
                if (user === undefined) {
                    return Promise.reject('User not authenticated')
                }
                const id = cuid()
                return ctx.prisma.collection.create({
                    data: {
                        id,
                        owner: {
                            connect: {
                                authUserId: user.auth0Id,
                            },
                        },
                        section: {
                            connect: {
                                id: sectionId,
                            },
                        },
                        slug: `new-collection-${id}`,
                    },
                })
            },
        })
        t.field('createEmptySection', {
            type: 'Section',
            async resolve(_, __, ctx: Context) {
                const user = await ctx.user
                if (user === undefined) {
                    return Promise.reject('User not authenticated')
                }
                const sectionsCount = (
                    await ctx.prisma.section.findMany({
                        where: { AND: { owner: { authUserId: user.auth0Id } } },
                    })
                ).length
                const id = cuid()
                return ctx.prisma.section.create({
                    data: {
                        id,
                        owner: {
                            connect: {
                                authUserId: user.auth0Id,
                            },
                        },
                        slug: `new-space-${id}`,
                        index: sectionsCount,
                    },
                })
            },
        })
        t.field('changeItemPosition', {
            type: 'Item',
            list: true,
            description: `Mutation changing the position of an item from his $oldIndex to the $newIndex.
            It takes *indexes* (not position) and return changed items with new position.
            `,
            args: {
                collectionId: schema.idArg({ required: true }),
                oldIndex: schema.intArg({ required: true }),
                newIndex: schema.intArg({ required: true }),
            },
            async resolve(
                _,
                { oldIndex, newIndex, collectionId },
                ctx: Context
            ) {
                const items = (
                    await ctx.prisma.item.findMany({
                        where: {
                            collection: { id: collectionId },
                            isDeleted: false,
                        },
                        select: { id: true, position: true },
                        // this order is related to items order on the page
                        // Should be nested order not supported by photon yet FIXME
                        orderBy: { createdAt: 'desc' },
                    })
                ).sort((a, b) => a.position - b.position) // FIXME here!

                const newIndexedItems = reAssignPosition(
                    items,
                    oldIndex,
                    newIndex
                )
                const updates: Array<ReturnType<
                    typeof ctx.prisma.item.update
                >> = []
                for (const item of newIndexedItems) {
                    updates.push(
                        ctx.prisma.item.update({
                            data: {
                                position: item.position,
                            },
                            where: { id: item.id },
                        })
                    )
                }
                await Promise.all(updates)
                return ctx.prisma.item.findMany({
                    where: {
                        OR: newIndexedItems.map(x => {
                            return {
                                id: x.id,
                            }
                        }),
                    },
                })
            },
        })
        t.field('createItemFromSearch', {
            type: 'Item',
            args: {
                id: schema.stringArg({ required: true }),
                kind: schema.stringArg({ required: true }),
                collectionId: schema.stringArg(),
                inbox: schema.booleanArg(),
            },
            async resolve(_, { id, kind, collectionId, inbox }, ctx: Context) {
                return createNewItemFromSearch(id, kind).then(async item => {
                    const user = await ctx.user
                    if (user === undefined) {
                        return Promise.reject('User not authenticated')
                    }
                    let connect
                    if (collectionId) {
                        connect = {
                            collection: {
                                connect: {
                                    id: collectionId,
                                },
                            },
                        }
                    } else if (inbox) {
                        connect = {
                            inboxOwner: {
                                connect: {
                                    authUserId: user.auth0Id,
                                },
                            },
                        }
                    }
                    return ctx.prisma.item.create({
                        data: {
                            title: item.title,
                            author: item.author,
                            type: item.type,
                            meta: item.meta && JSON.stringify(item.meta), // FIXME JSON fields not supported yet
                            provider: item.provider,
                            productUrl: item.productUrl,
                            imageUrl: item.imageUrl,
                            ...connect,
                        },
                    })
                })
            },
        })
        t.field('createItemFromUrl', {
            type: 'Item',
            args: {
                url: schema.stringArg({ required: true }),
                collectionId: schema.stringArg(),
                inbox: schema.booleanArg(),
            },
            async resolve(_, { url, collectionId, inbox }, ctx: Context) {
                return inferNewItemFromUrl(url).then(async item => {
                    const user = await ctx.user
                    if (user === undefined) {
                        return Promise.reject('User not authenticated')
                    }
                    let connect: {
                        collection?: CollectionCreateManyWithoutOwnerInput
                        inboxOwner?: UserCreateOneWithoutCollectionsInput
                    } = {}

                    if (collectionId) {
                        connect = {
                            collection: {
                                connect: {
                                    id: collectionId,
                                },
                            },
                        }
                    } else if (inbox) {
                        connect = {
                            inboxOwner: {
                                connect: {
                                    authUserId: user.auth0Id,
                                },
                            },
                        }
                    }
                    return ctx.prisma.item.create({
                        data: {
                            title: item.title,
                            author: item.author,
                            type: item.type,
                            meta: item.meta && JSON.stringify(item.meta), // FIXME JSON fields not supported yet
                            provider: item.provider,
                            productUrl: item.productUrl,
                            imageUrl: item.imageUrl,
                            ...connect,
                        },
                    })
                })
            },
        })
    },
})
