import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import APIEndPoints from '../../middleware/ApiEndPoints';

export default function SubjectForm() {
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        creditHours: 3,
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();
    const subjectAPI = APIEndPoints.create_subject;

    useEffect(() => {
        if (!currentUser || !['admin', 'manager'].includes(currentUser.roles)) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setUploadProgress(0);

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('code', formData.code);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('creditHours', formData.creditHours);
            formDataToSend.append('isActive', formData.isActive);

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            const response = await axios({
                url: subjectAPI.url,
                method: subjectAPI.method,
                data: formDataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                }
            });

            if (response.data.success === false) {
                throw new Error(response.data.message);
            }

            toast.success('Subject created successfully!');
            setFormData({
                name: '',
                code: '',
                description: '',
                creditHours: 3,
                isActive: true
            });
            setImageFile(null);
            setImagePreview('');
            setUploadProgress(0);

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!window.confirm('Are you sure you want to cancel?')) return;
        navigate('/subjectForm'); // adjust this route if needed
        setFormData({
            name: '',
            code: '',
            description: '',
            creditHours: 3,
            isActive: true
        });
    };

    if (!currentUser || !['admin', 'manager'].includes(currentUser.roles)) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-tertiary">
                <div className="px-6 py-4 bg-secondary">
                    <h2 className="text-xl font-semibold text-primary">Create New Subject</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                    placeholder="subject name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                                <input
                                    type="text"
                                    id="code"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                    placeholder="subject code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                    placeholder="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="creditHours" className="block text-sm font-medium text-gray-700 mb-1">Credit Hours</label>
                                <input
                                    type="number"
                                    id="creditHours"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                    value={formData.creditHours}
                                    onChange={handleChange}
                                    min={1}
                                    max={10}
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="h-4 w-4 text-primary rounded focus:ring-primary"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">Active Subject</label>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Image</label>
                                <div className="flex items-center gap-4 mb-3">
                                    <label className="flex items-center justify-center px-4 py-2 bg-tertiary text-primary rounded-lg cursor-pointer hover:bg-secondary/20 transition-colors">
                                        <span className="text-sm">Choose File</span>
                                        <input
                                            type="file"
                                            id="image-upload"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </label>
                                    {imageFile && <span className="text-sm text-gray-600">{imageFile.name}</span>}
                                </div>

                                {imagePreview && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-1">Preview:</p>
                                        <img
                                            src={imagePreview}
                                            alt="Subject preview"
                                            className="max-w-xs max-h-40 object-contain border rounded-lg"
                                        />
                                    </div>
                                )}

                                {loading && (
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div
                                                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-tertiary">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 border bg-error/60 hover:bg-error border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-70 transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create Subject'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
