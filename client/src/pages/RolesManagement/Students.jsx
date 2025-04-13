import UserList from "../../components/UserList";
import APIEndPoints from "../../middleware/ApiEndPoints";

const Students = () => {

    const getStudentAPI = APIEndPoints.get_students.url
    const deleteStudentAPI = APIEndPoints.delete_user.url

    return (
        <UserList
            userType="Student"
            apiEndpoint={getStudentAPI}
            deleteEndpoint={deleteStudentAPI}
        />
    );
};

export default Students;