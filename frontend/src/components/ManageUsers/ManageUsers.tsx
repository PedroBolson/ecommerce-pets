import React, { useState, useEffect } from 'react';
import './ManageUsers.css';
import { authService } from '../../services/auth.service';

interface User {
    id: string;
    email: string;
    role: string;
}

interface UserFormData {
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
    role: string;
}

const ManageUsers: React.FC = () => {
    const [authUser, setAuthUser] = useState<{ id: string; email: string; role: string } | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit' | 'password' | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    // Form state
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });

    useEffect(() => {
        const currentUser = authService.getUserFromToken();
        setAuthUser(currentUser);

        if (!currentUser || currentUser.role !== 'admin') {
            setError('You do not have permission to access this page');
            setLoading(false);
            return;
        }

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/users?page=${currentPage}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading users: ${response.status}`);
            }

            const data = await response.json();

            let usersData: User[] = [];
            if (Array.isArray(data)) {
                usersData = data;
                setTotalPages(1);
            } else if (data.data && Array.isArray(data.data)) {
                usersData = data.data;
                setTotalPages(data.pagination?.totalPages || 1);
            } else {
                console.error('Unexpected API response format:', data);
            }

            setUsers(usersData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setFormMode('create');
        setSelectedUser(null);
        setFormData({
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
            role: 'user'
        });
    };

    const handleEditUser = (user: User) => {
        setFormMode('edit');
        setSelectedUser(user);
        setFormData({
            email: user.email,
            confirmEmail: user.email,
            password: '',
            confirmPassword: '',
            role: user.role
        });
    };

    const handleResetPassword = (user: User) => {
        setFormMode('password');
        setSelectedUser(user);
        setFormData({
            email: user.email,
            confirmEmail: user.email,
            password: '',
            confirmPassword: '',
            role: user.role
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/users/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting user: ${response.status}`);
            }

            alert('User successfully deleted');
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting user');
            console.error(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formMode === 'create' || formMode === 'password') {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }

            if (formData.password.length < 8) {
                setError('Password must have at least 8 characters');
                return false;
            }

            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
                return false;
            }
        }

        if (formMode === 'create' || formMode === 'edit') {
            if (formData.email !== formData.confirmEmail) {
                setError('Emails do not match');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        const token = localStorage.getItem('token');

        try {
            if (formMode === 'create') {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error creating user: ${response.status}`);
                }

                alert('User created successfully');
            } else if (formMode === 'edit' && selectedUser) {
                const { password, confirmPassword, ...updateData } = formData;

                const response = await fetch(`http://localhost:3000/users/${selectedUser.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error updating user: ${response.status}`);
                }

                alert('User updated successfully');
            } else if (formMode === 'password' && selectedUser) {
                const response = await fetch('http://localhost:3000/users/reset-password', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error resetting password: ${response.status}`);
                }

                alert('Password changed successfully');
            }

            setFormMode(null);
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error processing request');
            console.error(err);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authUser?.role !== 'admin') {
        return (
            <div className="manage-users">
                <div className="error-message">
                    <h2>Restricted Access</h2>
                    <p>Only administrators can access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-users">
            <div className="section-header">
                <h2>Manage Users</h2>
                <button className="create-button" onClick={handleCreateNew}>
                    New User
                </button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by email or role..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            {formMode && (
                <div className="form-container">
                    <h3>
                        {formMode === 'create'
                            ? 'Create New User'
                            : formMode === 'edit'
                                ? 'Edit User'
                                : 'Reset Password'}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={formMode === 'password'}
                            />
                        </div>

                        {(formMode === 'create' || formMode === 'edit') && (
                            <div className="form-group">
                                <label htmlFor="confirmEmail">Confirm Email:</label>
                                <input
                                    type="email"
                                    id="confirmEmail"
                                    name="confirmEmail"
                                    value={formData.confirmEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}

                        {(formMode === 'create' || formMode === 'password') && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        minLength={8}
                                    />
                                    <small className="helper-text">
                                        Minimum 8 characters, include uppercase, lowercase and numbers
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password:</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {(formMode === 'create' || formMode === 'edit') && (
                            <div className="form-group">
                                <label htmlFor="role">Role:</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="save-button">
                                {formMode === 'create'
                                    ? 'Create'
                                    : formMode === 'edit'
                                        ? 'Save'
                                        : 'Reset Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormMode(null);
                                    setSelectedUser(null);
                                    setError(null);
                                }}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!formMode && (
                <div className="users-list">
                    {loading ? (
                        <div className="loading">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <p className="no-items">No users found.</p>
                    ) : (
                        <>
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr
                                            key={user.id}
                                            className={user.id === authUser?.id ? 'current-user-row' : ''}
                                        >
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role === 'admin' ? 'Administrator' : 'User'}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <div className="table-actions">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="edit-button"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(user)}
                                                        className="password-button"
                                                    >
                                                        Password
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="delete-button"
                                                        disabled={user.id === authUser?.id}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageUsers;