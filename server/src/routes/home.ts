const routes = [
    {
        'path': '/',
        'method': 'get',
        'controller': 'home',
        'fn': 'home',
    },
    {
        'path': '/test/:id',
        'method': 'get',
        'controller': 'home',
        'fn': 'home',
    },
    {
        'path': '/error404',
        'method': 'get',
        'controller': 'home',
        'fn': 'error',
    }
]

export default routes;