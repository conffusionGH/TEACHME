import SubjectList from '../../components/SubjectList';
import APIEndPoints from '../../middleware/ApiEndPoints';

const Subjects = () => {
  const getSubjectsAPI = APIEndPoints.get_subjects.url;
  const deleteSubjectAPI = APIEndPoints.delete_subject.url;

  return (
    <SubjectList 
      apiEndpoint={getSubjectsAPI} 
      deleteEndpoint={deleteSubjectAPI} 
    />
  );
};

export default Subjects;
