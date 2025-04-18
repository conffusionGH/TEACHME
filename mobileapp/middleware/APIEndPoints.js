const SERVER_DOMAIN = "http://192.168.1.96:8000/api" //hostel_4/5 Wifi
// const SERVER_DOMAIN = "http://192.168.137.22:8000/api" //hotspot Wifi



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
}

export default APIEndPoints;


