



import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import APIEndPoints from '../../middleware/ApiEndPoints';

export default function AssignmentForm() {
    const navigate = useNavigate();
    const assignmentAPI = APIEndPoints.create_assignment;
    const getSubjectsAPI = APIEndPoints.get_all_subjects_no_pagination;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subjectId: ''
    });
    const [deadlineDate, setDeadlineDate] = useState('');
    const [deadlineTime, setDeadlineTime] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const pdfInputRef = useRef(null);


    // Fetch Subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios({
                    url: getSubjectsAPI.url,
                    method: getSubjectsAPI.method,
                });

                if (response.data.success === false) {
                    throw new Error(response.data.message);
                }

                setSubjects(response.data.data || []);
            } catch (error) {
                toast.error(error.response?.data?.message || error.message || 'Failed to fetch subjects');
            }
        };

        fetchSubjects();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            toast.error('Please upload a valid PDF file');
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const deadline = `${deadlineDate}T${deadlineTime}`;
            const formDataToSend = new FormData();

            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('subjectId', formData.subjectId);
            formDataToSend.append('deadline', deadline);

            if (pdfFile) {
                formDataToSend.append('pdf', pdfFile);
            }

            const response = await axios({
                url: assignmentAPI.url,
                method: assignmentAPI.method,
                data: formDataToSend,
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success === false) {
                throw new Error(response.data.message);
            }

            toast.success('Assignment created successfully!');
            setFormData({ title: '', description: '', subjectId: '' });
            setDeadlineDate('');
            setDeadlineTime('');
            setPdfFile(null);
            if (pdfInputRef.current) {
                pdfInputRef.current.value = null; 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-tertiary">
                <div className="px-6 py-4 bg-secondary">
                    <h2 className="text-xl font-semibold text-primary">Create New Assignment</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                    placeholder="Assignment Title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="description"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                    placeholder="Assignment Description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
                                <input
                                    type="date"
                                    id="deadlineDate"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    value={deadlineDate}
                                    onChange={(e) => setDeadlineDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="deadlineTime" className="block text-sm font-medium text-gray-700 mb-1">Deadline Time</label>
                                <input
                                    type="time"
                                    id="deadlineTime"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    value={deadlineTime}
                                    onChange={(e) => setDeadlineTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <select
                                    id="subjectId"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    value={formData.subjectId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select a subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject._id} value={subject._id} disabled={!subject.isActive}>
                                            {subject.name} - {subject.code}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-1">
                                <label htmlFor="pdf" className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
                                <input
                                    type="file"
                                    id="pdf"
                                    ref={pdfInputRef}
                                    accept="application/pdf"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-tertiary">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-4 py-2 border bg-error/60 hover:bg-error border-gray-300 rounded-lg text-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-70 transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create Assignment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
