import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import APIEndPoints from '../../middleware/ApiEndPoints';

const SubmissionList = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const submissionFetch = `${APIEndPoints.submit_assignment.url}/${assignmentId}`;

  console.log('Assignment ID:', assignmentId);
  console.log('Submission Fetch URL:', submissionFetch);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(submissionFetch, {
          withCredentials: true
        });

        console.log(response)

        // Ensure response.data is an array
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || []; // Handle { success: true, data: [...] }
        
        setSubmissions(data);
      } catch (err) {
        console.error('Fetch submissions error:', err.response?.data, err.response?.status);
        setError(err.response?.data?.message || 'Failed to fetch submissions');
        toast.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId, submissionFetch]);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions found for this assignment</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission._id} className="p-4 border rounded-lg">
              <h3 className="font-medium">{submission.title}</h3>
              <p className="text-sm text-gray-600">{submission.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Submitted on: {new Date(submission.submittedAt).toLocaleString()}
              </p>
              {submission.student && (
                <p className="text-xs text-gray-500">
                  Submitted by: {submission.student.username} ({submission.student.email})
                </p>
              )}
              <p className="text-xs text-gray-500">
                Status: {submission.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionList;