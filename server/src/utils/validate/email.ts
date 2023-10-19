const ValidateEmail = (email: string):Promise<undefined | string> => {

    if(typeof email !== 'string') return Promise.resolve('Email is a required field');

    if(email.length < 5) return Promise.resolve('Email must be at least 5 characters long');

    if(email.length > 50) return Promise.resolve('Email must be less than 50 characters long');

    if(!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) return Promise.resolve('Email must be a valid email address');

    return Promise.resolve(undefined);
}

export default ValidateEmail;