import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import APIEndPoints from '../../middleware/ApiEndPoints';
import { useSelector } from 'react-redux';

const RolesIndustry = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState({});

    const { currentUser } = useSelector((state) => state.user);
    const apiAllUsers = APIEndPoints.get_all_users.url;
    const updateAllRoles = APIEndPoints.update_user_role.url;

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${apiAllUsers}?page=${page}`, {
                withCredentials: true
            });

            let usersData = response.data?.users || [];
            
            // Filter users based on current user's role
            if (currentUser?.roles === 'manager') {
                usersData = usersData.filter(user => 
                    user.roles === 'teacher' || user.roles === 'student'
                );
            } else if (currentUser?.roles === 'teacher') {
                usersData = usersData.filter(user => user.roles === 'student');
            }

            setUsers(usersData);
            const rolesMap = {};
            usersData.forEach(user => {
                rolesMap[user._id] = user.roles;
            });
            setSelectedRoles(rolesMap);

            setCurrentPage(response.data?.currentPage ? response.data.currentPage - 1 : 0);
            setTotalPages(response.data?.totalPages || 0);
            setTotalUsers(response.data?.totalUsers || 0);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch users');
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [currentUser?.roles]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        fetchUsers(selectedPage);
    };

    const handleRoleChange = (userId, newRole) => {
        setSelectedRoles(prev => ({
            ...prev,
            [userId]: newRole
        }));
    };

    const handleUpdateRole = async (userId) => {
        const newRole = selectedRoles[userId];
        if (!newRole) return;

        try {
            await axios.post(
                `${updateAllRoles}/${userId}`,
                { roles: newRole },
                { withCredentials: true }
            );
            toast.success('Role updated successfully');
            fetchUsers(currentPage + 1);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    };

    const getAvailableRoles = () => {
        switch(currentUser?.roles) {
            case 'admin':
                return ['student', 'teacher', 'manager', 'admin'];
            case 'manager':
                return ['student', 'teacher'];
            case 'teacher':
                return ['student'];
            default:
                return [];
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-center text-error">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-tertiary">
                <div className="px-6 py-4 bg-secondary ">
                    <h2 className="text-xl font-semibold text-primary">
                        User Roles Management ({totalUsers})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-tertiary">
                        <thead className="bg-tertiary ">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">
                                    Current Role
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">
                                    New Role
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-tertiary">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-tertiary/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img 
                                                        className="h-10 w-10 rounded-full" 
                                                        src={user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                                                        alt={user.username}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.username}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.roles === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.roles === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                user.roles === 'teacher' ? 'bg-green-100 text-green-800' :
                                                'bg-secondary/20 text-secondary'
                                            }`}>
                                                {user.roles.charAt(0).toUpperCase() + user.roles.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="relative">
                                                <select
                                                    value={selectedRoles[user._id] || user.roles}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                >
                                                    {getAvailableRoles().map(role => (
                                                        <option key={role} value={role}>
                                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleUpdateRole(user._id)}
                                                disabled={selectedRoles[user._id] === user.roles}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    selectedRoles[user._id] === user.roles
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                                }`}
                                            >
                                                Update Role
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-tertiary bg-tertiary">
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'flex justify-center space-x-2'}
                            pageClassName={' rounded-lg border border-tertiary hover:bg-secondary/20'}
                            pageLinkClassName={'text-primary px-3 py-2'}
                            activeClassName={'bg-secondary'}
                            previousClassName={'px-3 py-1 rounded-lg border border-tertiary bg-secondary/20 hover:bg-primary/20'}
                            nextClassName={'px-3 py-1 rounded-lg border border-tertiary bg-secondary/20 hover:bg-primary/20'}
                            disabledClassName={'opacity-50 cursor-not-allowed'}
                            forcePage={currentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RolesIndustry;