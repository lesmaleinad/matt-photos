module.exports = {
    siteMetadata: {
        title: 'Matt Dahle Photography',
    },
    plugins: [
        'gatsby-plugin-material-ui',
        'gatsby-plugin-layout',
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
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
