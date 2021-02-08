module.exports = {
    siteMetadata: {
        title: 'Matt Dahle Photography',
    },
    plugins: [
        'gatsby-plugin-material-ui',
        'gatsby-plugin-layout',
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
