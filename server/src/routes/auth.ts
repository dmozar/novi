const routes = [
    {
        'path': '/auth/login',
        'method': 'post',
        'controller': 'auth',
        'fn': 'login',
        'validate': {
            'email': 'required|email',
            'password': 'required|password'
        }
    },
    {
        'path': '/auth/logout',
        'method': 'put',
        'controller': 'auth',
        'fn': 'logout',
        'authenticated': true,
    },
    {
        'path': '/auth/remove',
        'method': 'delete',
        'controller': 'auth',
        'fn': 'remove',
        'authenticated': true,
    },
    {
        'path': '/auth/register',
        'method': 'post',
        'controller': 'auth',
        'fn': 'register',
        'validate': {
            'firstName': 'required|string|alpha|minLength:2|maxLength:50',
            'lastName': 'required|string|alpha|minLength:2|maxLength:50',
            'email': 'required|email',
            'password': 'required|password'
        }
    }
]

export default routes;