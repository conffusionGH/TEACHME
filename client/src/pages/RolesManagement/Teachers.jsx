import UserList from "../../components/UserList";
import APIEndPoints from "../../middleware/ApiEndPoints";

const Teachers = () => {

    const getTeacherAPI = APIEndPoints.get_teachers.url
    const deleteTeacherAPI = APIEndPoints.delete_user.url


    return (
        <UserList
            userType="Teacher"
            apiEndpoint={getTeacherAPI}
            deleteEndpoint={deleteTeacherAPI}
        />
    );
};

export default Teachers;