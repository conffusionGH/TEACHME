// const SERVER_DOMAIN = "http://192.168.1.96:8000/api" //hostel_4/5 Wifi
// const SERVER_DOMAIN = "http://192.168.137.22:8000/api" //hotspot Wifi
// SERVER_DOMAIN = "http://10.0.2.2:8000/api"
SERVER_DOMAIN = "http://192.168.1.100:8000/api"


console.log("Server Domain:", SERVER_DOMAIN);

const APIEndPoints = {
    sign_in: {
        url: `${SERVER_DOMAIN}/auth/signin`,
        method: 'post'
    },
    get_subjects: {
        url: `${SERVER_DOMAIN}/subjects/all`,
        method: 'GET'
    },
    get_assignments: {
        url: `${SERVER_DOMAIN}/assignment`,
        method: 'GET'
    },
    download_video: {
        url: `${SERVER_DOMAIN}/subjects/download-video`,
        method: 'GET'
    },
    download_pdf: {
        url: `${SERVER_DOMAIN}/subjects/download-pdf`,
        method: 'GET'
    },
    request_form: {
        url: `${SERVER_DOMAIN}/request-form`,
        method: 'POST'
    },
}

export default APIEndPoints;


