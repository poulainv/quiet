Tottem is an experimentation about building a product. I have two considerations in mind: product and open-source technologies.

## Product

First, imagine & design a product human centered allowing people to build and manage their online and public library. Just a tool to manage and gather the content we love, in order to share it with friends & community 😇

### Why ?

Social medial are now all stream based. More and more, humans — especially journalists, are loosing their ability to choose which content to promote and amplify. Instead, recommendation systems feed our personnal narrative content stream, that only consider clicks and views. What else they can do? [Here, I'm happy to share some references](https://beta.tottem.app/vincent/c/inspirational-content-about-why-social-media-companies-are-dangerous-for-personal-attention-and-democracy-ck5i4lwp2000vws9e4ry25feh)

So, what if I want to explore a friend's books or articles recommendation? What if I want to really dig a specific subject?

### How ?

Tottem suggests to combine personal productivity tool approach with (slow) social media capabilities to make users empowered and somehow emancipated.

Tottem aims to provide the same high quality user experience that most of modern productivity tools provide. Managing your library should be easy and enjoyable. With great tool, great content and collection can be made and shared.

The basic workflow:

1. Collect everything in one Inbox.
2. Organise into Spaces and Collection.
3. Express yourself and explain your opinion
4. Publish and share with your community

<div>

[![Tottem](./public/screenshot-inbox.png)](https://beta.tottem.app)

</div>

[![Tottem](./public/screenshot-profile.png)](https://beta.tottem.app)

## Technology

The second goal is about experimenting how to build a web software today. This the documentation explains which technologies are used here and how they are organised.

### Codebase

#### Technologies

It's a full-stack Typescript with some code generation in order to have a type safe experience from end-to-end.

Here is a list of main technologies used:

-   🚀 React
-   🥇 NextJS to provide fast SSR experience
-   😍 TailwindCSS
-   📱 GraphQL, powered by Apollo tools
-   👮‍♂️ Auth0 for authentication
-   🚓 Prisma Framework to manage data model and database

**How is it typesafe end-to-end?**

**Prisma** provides a [library](https://github.com/prisma/photonjs) Photon that _generate_ a typesafe client to manipulate data depending on a unique schema declaration in `schema.prisma` file.

Example where Photon is used to retrieve the not softly deleted items from specific collection :

```
const items = (
    await ctx.photon.items.findMany({
        where: {
            collection: { id: collectionId },
            isDeleted: false,
        },
        select: { id: true, position: true },
        orderBy: { createdAt: 'desc' },
    })
```

**Nexus** provides a code-first graphql approach that allow you to _generate_ graphql schema (`schema.graphql` file) based on your resolvers and object definitions. Nexus is fully compliant with prisma and offered a nice [plugin](https://github.com/prisma-labs/nexus-prisma) to automatically declare resolvers based on your photon client.

**Codegen** [tool](https://graphql-code-generator.com/) is configured to parse all `.gql` front-end files containing graphl queries and mutation. With remote and local (from Apollo Client) graphql schemas allow **graphql-codegen** to generate all types and hooks (`types.ts`) we need to fetch and mutate data safely.

Example where typesafe hook `useGetItemsQuery` is generated allowing to fetch data via Apollo Client smoothly

```
const { data } = useGetItemsQuery({
        variables: {
            collectionId,
        },
    })
```

#### Repository structure

Inspired by those [recommendation](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1), this is how the codebase is structured:

```sh
tottem/
├── src
├──── generated # contains generated code (types, hooks, ...)
├──── pages # static and dynamic routes declaration used by NextJS
├──── scenes # different parts of the application
├────── moduleName # Auth | Profile | Me ...
├──────── components # shared components module each components can specify its own specific components, queries, ...
├──────── queries.gql # All data queries and mutation are written in gql files
├──────── hooks.ts # Most of the reusable logic is written in hooks
├──────── index.tsx # Main scene file
├──────── View.tsx # Sometime stateless component are isolated in View file for clarity or reusability
└──── services # shared services as authentication, error management, ...
```

### Contributors

-   Clément Déon [@deonclem](https://github.com/deonclem)
