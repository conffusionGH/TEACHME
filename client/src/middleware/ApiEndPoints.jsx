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
    update_user_role: {
        url: `${serverDomain}/user/update-role`,
        method: 'post'
    },
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
    },
    image_upload: {
        url: `${serverDomain}/image/upload`,
        method: 'POST'
    },
    create_subject: {
        url: `${serverDomain}/subjects`,
        method: 'POST'
    },
    get_subjects: {
        url: `${serverDomain}/subjects`,
        method: 'GET'
    },
    delete_subject: {
        url: `${serverDomain}/subjects`,
        method: 'DELETE'
    },
    get_deleted_subjects: {
        url: `${serverDomain}/subjects/delete`,
        method: 'GET'
    },
    restore_subject: {
        url: `${serverDomain}/subjects/restore`,
        method: 'DELETE'
    },
    permanent_delete_subject: {
        url: `${serverDomain}/subjects/permanent`,
        method: 'GET'
    },
    clear_subject_recycle_bin: {
        url: `${serverDomain}/subjects/recycle-bin/clear`,
        method: 'DELETE'
    },
    get_subject: {
        url: `${serverDomain}/subjects`,
        method: 'GET'
    },
    update_subject: {
        url: `${serverDomain}/subjects`,
        method: 'PUT'
    },
    create_assignment: {
        url: `${serverDomain}/assignment`,
        method: 'POST'
    },
    get_all_subjects_no_pagination: {
        url: `${serverDomain}/subjects/all`,
        method: 'GET'
    },
    upload_assignment_pdf: {
        url: `${serverDomain}/image/upload-pdf`,
        method: 'POST'
    },
    get_assignments_paginated: {
        url: `${serverDomain}/assignment/paginatedassignment`, // Use paginated endpoint
        method: 'GET',
    },
    delete_assignment: {
        url: `${serverDomain}/assignment`,
        method: 'DELETE',
    },
    get_deleted_assignments: {
        url: `${serverDomain}/assignment/bin/deleted`,
        method: 'GET',
    },
    restore_assignment: {
        url: `${serverDomain}/assignment/bin/restore`,
        method: 'PUT',
    },
    permanent_delete_assignment: {
        url: `${serverDomain}/assignment/bin/permanent`,
        method: 'DELETE',
    },
    clear_assignment_recycle_bin: {
        url: `${serverDomain}/assignment/bin/clear`,
        method: 'DELETE',
    },
    download_assignment: {
        url: `${serverDomain}/assignment/download`,
        method: 'get'
    },
    update_assignment: {
        url: `${serverDomain}/assignment`,
        method: 'put'
    },
    get_assignment:{
        url: `${serverDomain}/assignment`,
        method: 'get'
    }





}

export default APIEndPoints;