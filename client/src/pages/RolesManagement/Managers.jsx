import UserList from "../../components/UserList";
import APIEndPoints from "../../middleware/ApiEndPoints";

const Managers = () => {

    const getManagerAPI = APIEndPoints.get_managers.url
    const deleteManagerAPI = APIEndPoints.delete_user.url
    
  return (
    <UserList
      userType="Manager" 
      apiEndpoint={getManagerAPI}
      deleteEndpoint={deleteManagerAPI}
    />
  );
};

export default Managers;