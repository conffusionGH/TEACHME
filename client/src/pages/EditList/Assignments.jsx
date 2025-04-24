// src/pages/Assignments.jsx
import AssignmentList from '../../components/AssignmentList.jsx';
import APIEndPoints from '../../middleware/ApiEndPoints.jsx';

const Assignments = () => {
  const getAssignmentsAPI = APIEndPoints.get_assignments_paginated?.url; 
  const deleteAssignmentAPI = APIEndPoints.delete_assignment?.url;
  const downloadAssignmentAPI = APIEndPoints.download_assignment?.url; 


  return (
    <AssignmentList
      apiEndpoint={getAssignmentsAPI}
      deleteEndpoint={deleteAssignmentAPI}
      downloadEndpoint={downloadAssignmentAPI}

    />
  );
};

export default Assignments;