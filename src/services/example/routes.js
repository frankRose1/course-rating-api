export default [
    {
        path: '/',
        method: 'get',
        handler: (req, res) => {
            res.json({ message: 'Hello World!' })
        }
    }
]