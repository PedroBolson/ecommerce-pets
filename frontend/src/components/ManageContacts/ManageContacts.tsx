import React, { useState, useEffect } from 'react';
import './ManageContacts.css';
import { API_CONFIG } from '../../config/api.config';

interface Contact {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
    isActive: boolean;
    phone?: string;
    city?: string;
    state?: string;
    interestUuid: string;
    isDog: boolean;
}

interface StoreItem {
    id: string;
    name: string;
    price: number;
    category: string | { name: string };
    imageUrl?: string;
    description?: string;
}

interface Dog {
    id: string;
    sku: string;
    breed: any;
    gender?: string;
    ageInMonths: number;
    size?: string;
    color?: string;
    price?: number;
    vaccinated?: boolean;
    dewormed?: boolean;
    certification?: string;
    imageUrl?: string;
    additionalInfo?: string;
    name?: string;
    age?: number;
}

interface InterestItem {
    type: 'storeItem' | 'dog';
    data: StoreItem | Dog;
}

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

const ManageContacts: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCount, setActiveCount] = useState(0);

    const [interestItem, setInterestItem] = useState<InterestItem | null>(null);
    const [loadingInterestItem, setLoadingInterestItem] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, [currentPage, searchTerm]);

    useEffect(() => {
        fetchActiveCount();
    }, []);

    const fetchActiveCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const countUrl = `${API_CONFIG.baseUrl}/contacts/count/active`;
            const response = await fetch(countUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading active count: ${response.status}`);
            }

            const data = await response.json();
            if (data && typeof data.count === 'number') {
                setActiveCount(data.count);
            } else {
                console.error("Unexpected response format:", data);
            }
        } catch (err) {
            console.error("Error fetching active count:", err);
        }
    };

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let url = `${API_CONFIG.baseUrl}/contacts?page=${currentPage}&limit=10`;

            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading contacts: ${response.status}`);
            }

            const data = await response.json();
            const contactsData = data.data || [];
            const pagination = data.pagination || {};
            setTotalPages(pagination.totalPages || 1);

            if (contactsData.length === 0 && pagination.total > 0 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                setContacts(contactsData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    async function safeFetch<T>(url: string, token: string): Promise<T | null> {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.log(`Request to ${url} failed with status: ${response.status}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`Network error when fetching ${url}:`, error);
            return null;
        }
    }

    const fetchInterestItem = async (uuid: string, isDog: boolean): Promise<InterestItem | null> => {
        if (!uuid) return null;

        try {
            setLoadingInterestItem(true);
            const token = localStorage.getItem('token') || '';

            if (isDog) {
                const dog = await safeFetch<Dog>(
                    `${API_CONFIG.baseUrl}/dog/${uuid}`,
                    token
                );

                if (dog) {
                    const rawPrice = (dog as any).price;
                    const priceNumber = typeof rawPrice === 'string'
                        ? parseFloat(rawPrice)
                        : (rawPrice as number) || 0;

                    const safeDog = {
                        ...dog,
                        name: `Dog ${dog.sku?.substring(0, 8) || 'Unnamed'}`,
                        breed: typeof dog.breed === 'object' && dog.breed?.name
                            ? dog.breed.name
                            : 'Unknown Breed',
                        age: Math.floor((dog.ageInMonths || 0) / 12),
                        ageInMonths: dog.ageInMonths || 0,
                        price: priceNumber,
                        description: dog.additionalInfo ? String(dog.additionalInfo) : '',
                        id: String(dog.id || uuid),
                        sku: String(dog.sku || uuid)
                    };
                    return { type: 'dog', data: safeDog };
                }
            } else {
                const storeItem = await safeFetch<StoreItem>(
                    `${API_CONFIG.baseUrl}/store-item/${uuid}`,
                    token
                );

                if (storeItem) {
                    const rawPrice = (storeItem as any).price;
                    const priceNumber = typeof rawPrice === 'string'
                        ? parseFloat(rawPrice)
                        : (rawPrice as number) || 0;
                    const safeItem = {
                        ...storeItem,
                        name: String(storeItem.name || ''),
                        category: typeof storeItem.category === 'object' && storeItem.category?.name
                            ? storeItem.category.name
                            : String(storeItem.category || ''),
                        price: priceNumber,
                        description: storeItem.description ? String(storeItem.description) : '',
                        imageUrl: storeItem.imageUrl || undefined
                    };
                    return { type: 'storeItem', data: safeItem };
                }
            }

            return null;
        } finally {
            setLoadingInterestItem(false);
        }
    };

    const handleMarkResolved = async (id: string) => {
        if (!window.confirm('Mark this contact as resolved? This will archive it.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_CONFIG.baseUrl}/contacts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: false })
            });

            if (!response.ok) {
                throw new Error(`Error updating contact: ${response.status}`);
            }

            if (selectedContact?.id === id) {
                setSelectedContact(null);
                setShowDetails(false);
                setInterestItem(null);
            }

            setContacts(prevContacts =>
                prevContacts.map(contact =>
                    contact.id === id
                        ? { ...contact, isActive: false }
                        : contact
                )
            );

            fetchActiveCount();

            const activeContactsLeft = contacts.filter(c =>
                c.id !== id && c.isActive
            ).length;

            if (activeContactsLeft === 0 && contacts.length === 1) {
                fetchContacts();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error marking as resolved');
            console.error(err);
        }
    };

    const handleViewDetails = async (contact: Contact) => {
        setSelectedContact(contact);
        setShowDetails(true);
        setInterestItem(null);

        if (contact.interestUuid) {
            const item = await fetchInterestItem(contact.interestUuid, contact.isDog);
            setInterestItem(item);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);

            if (searchTerm) {
                fetchContacts();
            }
        }
    };

    const filteredContacts = contacts
        .filter(contact => {
            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return (
                contact.fullName.toLowerCase().includes(searchLower) ||
                contact.email.toLowerCase().includes(searchLower) ||
                (contact.phone && contact.phone.toLowerCase().includes(searchLower))
            );
        })
        .sort((a, b) => {
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    return (
        <div className="manage-contacts">
            <div className="mc-section-header">
                <h2>Contact Management</h2>
                {activeCount > 0 && (
                    <div className="mc-notification-summary">
                        <span className="mc-active-count">
                            {activeCount} active message{activeCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            <div className="mc-search-bar">
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {error && <div className="mc-error-message">{error}</div>}

            {loading ? (
                <div className="mc-loading">Loading contacts...</div>
            ) : filteredContacts.length === 0 ? (
                <p className="mc-no-contacts">
                    {searchTerm ? "No contacts match your search." : "No contacts found."}
                </p>
            ) : (
                <div className="mc-contacts-container">
                    <table className="mc-contacts-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Interest</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map(contact => (
                                <tr key={contact.id} className={contact.isActive ? 'mc-active-row' : 'mc-inactive-row'}>
                                    <td>{contact.fullName}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone || 'N/A'}</td>
                                    <td>{formatDate(contact.createdAt)}</td>
                                    <td>
                                        <span className={`mc-status-badge ${contact.isActive ? 'mc-active' : 'mc-resolved'}`}>
                                            {contact.isActive ? 'Active' : 'Resolved'}
                                        </span>
                                    </td>
                                    <td>
                                        {contact.interestUuid ? (
                                            <span className={`mc-interest-badge ${contact.isDog ? 'mc-dog-badge' : 'mc-product-badge'}`}>
                                                {contact.isDog ? 'Dog' : 'Product'}
                                            </span>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </td>
                                    <td className="mc-actions-cell">
                                        <button
                                            className="mc-view-button"
                                            onClick={() => handleViewDetails(contact)}
                                        >
                                            View
                                        </button>
                                        {contact.isActive && (
                                            <button
                                                className="mc-resolve-button"
                                                onClick={() => handleMarkResolved(contact.id)}
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="mc-pagination">
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
                </div>
            )}

            {showDetails && selectedContact && (
                <div className="mc-contact-details-overlay">
                    <div className="mc-contact-details">
                        <h3>Contact Details</h3>

                        <div className="mc-detail-row">
                            <span className="mc-label">Name:</span>
                            <span className="mc-value">{selectedContact.fullName}</span>
                        </div>

                        <div className="mc-detail-row">
                            <span className="mc-label">Email:</span>
                            <span className="mc-value">{selectedContact.email}</span>
                        </div>

                        {selectedContact.phone && (
                            <div className="mc-detail-row">
                                <span className="mc-label">Phone:</span>
                                <span className="mc-value">{selectedContact.phone}</span>
                            </div>
                        )}

                        {selectedContact.city && (
                            <div className="mc-detail-row">
                                <span className="mc-label">City:</span>
                                <span className="mc-value">{selectedContact.city}</span>
                            </div>
                        )}

                        {selectedContact.state && (
                            <div className="mc-detail-row">
                                <span className="mc-label">State:</span>
                                <span className="mc-value">{selectedContact.state}</span>
                            </div>
                        )}

                        <div className="mc-detail-row">
                            <span className="mc-label">Date:</span>
                            <span className="mc-value">{formatDate(selectedContact.createdAt)}</span>
                        </div>

                        {selectedContact.interestUuid && (
                            <div className="mc-interest-section">
                                <h4>Interest Information</h4>
                                {loadingInterestItem ? (
                                    <p>Loading interest item...</p>
                                ) : interestItem ? (
                                    <div className="mc-interest-details">
                                        <div className="mc-detail-row">
                                            <span className="mc-label">Type:</span>
                                            <span className="mc-value">
                                                {interestItem.type === 'storeItem' ? 'Product' : 'Dog'}
                                            </span>
                                        </div>

                                        {(interestItem.type !== 'dog' || (interestItem.data as Dog).name) && (
                                            <div className="mc-detail-row">
                                                <span className="mc-label">Name:</span>
                                                <span className="mc-value">
                                                    {interestItem.type === 'dog'
                                                        ? `${(interestItem.data as Dog).sku}`
                                                        : String(interestItem.data.name)}
                                                </span>
                                            </div>
                                        )}

                                        {interestItem.type === 'storeItem' && (
                                            <>
                                                <div className="mc-detail-row">
                                                    <span className="mc-label">Category:</span>
                                                    <span className="mc-value">
                                                        {String((interestItem.data as StoreItem).category)}
                                                    </span>
                                                </div>
                                                <div className="mc-detail-row">
                                                    <span className="mc-label">Price:</span>
                                                    <span className="mc-value">
                                                        {typeof (interestItem.data as StoreItem).price === 'number'
                                                            ? formatPrice((interestItem.data as StoreItem).price)
                                                            : '₫0'}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {interestItem.type === 'dog' && (
                                            <>
                                                <div className="mc-detail-row">
                                                    <span className="mc-label">Breed:</span>
                                                    <span className="mc-value">
                                                        {typeof (interestItem.data as Dog).breed === 'string' ? (interestItem.data as Dog).breed : (interestItem.data as Dog).breed?.name || 'Unknown Breed'}
                                                    </span>
                                                </div>

                                                {(interestItem.data as Dog).gender && (
                                                    <div className="mc-detail-row">
                                                        <span className="mc-label">Gender:</span>
                                                        <span className="mc-value">
                                                            {String((interestItem.data as Dog).gender)}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="mc-detail-row">
                                                    <span className="mc-label">Age:</span>
                                                    <span className="mc-value">
                                                        {(interestItem.data as Dog).age} {(interestItem.data as Dog).age === 1 ? 'year' : 'years'}
                                                        {(interestItem.data as Dog).ageInMonths ? ` (${(interestItem.data as Dog).ageInMonths} months)` : ''}
                                                    </span>
                                                </div>

                                                <div className="mc-detail-row">
                                                    <span className="mc-label">Price:</span>
                                                    <span className="mc-value">
                                                        {typeof (interestItem.data as Dog).price === 'number'
                                                            ? formatPrice((interestItem.data as Dog).price || 0)
                                                            : '₫0'}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {(interestItem.type === 'storeItem' && (interestItem.data as StoreItem).description) ||
                                            (interestItem.type === 'dog' && (interestItem.data as Dog).additionalInfo) ? (
                                            <div className="mc-detail-row">
                                                <span className="mc-label">Description:</span>
                                                <span className="mc-value">
                                                    {(() => {
                                                        const desc = interestItem.type === 'storeItem'
                                                            ? (interestItem.data as StoreItem).description
                                                            : (interestItem.data as Dog).additionalInfo;
                                                        if (typeof desc === 'string') return desc;
                                                        if (typeof desc === 'object') return JSON.stringify(desc);
                                                        return String(desc);
                                                    })()}
                                                </span>
                                            </div>
                                        ) : null}

                                        {interestItem.type === 'storeItem' && interestItem.data.imageUrl && (
                                            <div className="mc-interest-image">
                                                <img
                                                    src={interestItem.data.imageUrl}
                                                    alt={interestItem.data.name}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p>No information found for this interest item.</p>
                                )}
                            </div>
                        )}

                        <div className="mc-detail-actions">
                            {selectedContact.isActive && (
                                <button
                                    className="mc-resolve-button"
                                    onClick={() => handleMarkResolved(selectedContact.id)}
                                >
                                    Mark as Resolved
                                </button>
                            )}
                            <button
                                className="mc-close-button"
                                onClick={() => {
                                    setShowDetails(false);
                                    setSelectedContact(null);
                                    setInterestItem(null);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageContacts;