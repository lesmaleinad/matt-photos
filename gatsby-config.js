module.exports = {
    siteMetadata: {
        title: 'Matt Dahle Photography',
    },
    plugins: [
        'gatsby-plugin-material-ui',
        'gatsby-plugin-layout',
        'gatsby-transformer-sharp',
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `src`,
                path: `${__dirname}/src/`,
            },
        },
        {
            resolve: 'gatsby-plugin-sharp',
            options: {
                defaultQuality: 100,
            },
        },
        {
            resolve: `gatsby-source-stripe`,
            options: {
                objects: ['Product', 'Price'],
                secretKey: process.env.STRIPE_API_SECRET,
                downloadFiles: true,
            },
        },
    ],
};
