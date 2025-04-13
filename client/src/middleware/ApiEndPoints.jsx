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
    },
    // User Management
    get_all_users: {
        url: `${serverDomain}/user`,
        method: 'get'
    },
    get_managers: {
        url: `${serverDomain}/user/managers`,
        method: 'get'
    },
    get_teachers: {
        url: `${serverDomain}/user/teachers`,
        method: 'get'
    },
    get_students: {
        url: `${serverDomain}/user/students`,
        method: 'get'
    },
    get_user: {
        url: `${serverDomain}/user`,
        method: 'get'
    },
    update_user: {
        url: `${serverDomain}/user/update`,
        method: 'post'
    },
    delete_user: {
        url: `${serverDomain}/user/delete`,
        method: 'delete'
    },
    update_user_role: {
        url: `${serverDomain}/user/update-role`,
        method: 'post'
    },

    // Recycle Bin
    get_deleted_users: {
        url: `${serverDomain}/user/bin/deleted`,
        method: 'get'
    },
    restore_user: {
        url: `${serverDomain}/user/bin/restore`,
        method: 'put'
    },
    permanent_delete_user: {
        url: `${serverDomain}/user/bin/permanent`,
        method: 'delete'
    },
    clear_recycle_bin: {
        url: `${serverDomain}/user/bin/clear`,
        method: 'delete'
    }
}

export default APIEndPoints;