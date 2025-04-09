const serverDomain = import.meta.env.VITE_SERVER_DOMAIN;
console.log("Server Domain:", serverDomain);

const APIEndPoints = { 
    sign_up: {
        url: `${serverDomain}/auth/signup`,
        method: 'post'
    },
    sign_in: {
        url: `${serverDomain}/auth/signin`,
        method: 'post'
    },
    sign_out: {
        url: `${serverDomain}/auth/signout`,
        method: 'get'
    },
    update_user: {
        url: `${serverDomain}/user/update`,
        method: 'post'
    },
    delete_user: {
        url: `${serverDomain}/user/delete`,
        method: 'delete'
    }
}
//get post loclahost800 crud

export default APIEndPoints;