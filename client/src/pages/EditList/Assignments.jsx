// src/pages/Assignments.jsx
import AssignmentList from '../../components/AssignmentList.jsx';
import APIEndPoints from '../../middleware/ApiEndPoints.jsx';

const Assignments = () => {
  const getAssignmentsAPI = APIEndPoints.get_assignments_paginated?.url || `${import.meta.env.VITE_SERVER_DOMAIN}/assignment`;
  const deleteAssignmentAPI = APIEndPoints.delete_assignment?.url || `${import.meta.env.VITE_SERVER_DOMAIN}/assignment`;

  return (
    <AssignmentList
      apiEndpoint={getAssignmentsAPI}
      deleteEndpoint={deleteAssignmentAPI}
    />
  );
};

export default Assignments;