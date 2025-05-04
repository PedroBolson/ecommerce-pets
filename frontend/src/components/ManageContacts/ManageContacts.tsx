import React, { useState, useEffect } from 'react';
import './ManageContacts.css';

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

const ManageContacts: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCount, setActiveCount] = useState(0);

    const [interestItem, setInterestItem] = useState<InterestItem | null>(null);
    const [loadingInterestItem, setLoadingInterestItem] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, [filterActive, currentPage]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let url = `http://localhost:3000/contacts?page=${currentPage}&limit=10`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading contacts: ${response.status}`);
            }

            const data = await response.json();
            setContacts(data.data || []);
            setTotalPages(data.pagination?.totalPages || 1);

            const activeMessages = (data.data || []).filter((contact: Contact) => contact.isActive).length;
            setActiveCount(activeMessages);

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
                    `http://localhost:3000/dog/${uuid}`,
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
                    `http://localhost:3000/store-item/${uuid}`,
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
                            : String(storeItem.category || ''), price: priceNumber,
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
        if (!window.confirm('Mark this contact as resolved? This will move it to the archived list.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/contacts/${id}`, {
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

            if (filterActive === true || filterActive === undefined) {
                setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));

                if (filterActive === undefined) {
                    setActiveCount(prevCount => Math.max(0, prevCount - 1));
                }
            } else {
                fetchContacts();
            }

            if (selectedContact?.id === id) {
                setSelectedContact(null);
                setShowDetails(false);
                setInterestItem(null);
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
        }
    };

    const filteredContacts = contacts
        .filter(contact => {
            if (filterActive === undefined) return contact.isActive;
            if (filterActive === false) return !contact.isActive;
            return true;
        })
        .filter(contact => {
            if (!searchTerm) return true;

            const searchLower = searchTerm.toLowerCase();
            return (
                contact.fullName.toLowerCase().includes(searchLower) ||
                contact.email.toLowerCase().includes(searchLower) ||
                (contact.phone && contact.phone.toLowerCase().includes(searchLower))
            );
        });

    return (
        <div className="manage-contacts">
            <div className="section-header">
                <h2>Contact Management</h2>
                <div className="filter-tabs">
                    <button
                        className={`tab-button ${filterActive === undefined ? 'active' : ''}`}
                        onClick={() => {
                            setFilterActive(undefined);
                            setCurrentPage(1);
                        }}
                    >
                        Messages
                        {activeCount > 0 && <span className="notification-badge">{activeCount}</span>}
                    </button>
                    <button
                        className={`tab-button ${filterActive === false ? 'false' : ''}`}
                        onClick={() => {
                            setFilterActive(false);
                            setCurrentPage(1);
                        }}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading contacts...</div>
            ) : filteredContacts.length === 0 ? (
                <p className="no-contacts">
                    {filterActive === false
                        ? "No resolved contacts found."
                        : "No messages found."}
                </p>
            ) : (
                <div className="contacts-container">
                    <table className="contacts-table">
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
                                <tr key={contact.id} className={contact.isActive ? 'active-row' : 'inactive-row'}>
                                    <td>{contact.fullName}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone || 'N/A'}</td>
                                    <td>{formatDate(contact.createdAt)}</td>
                                    <td>
                                        <span className={`status-badge ${contact.isActive ? 'active' : 'resolved'}`}>
                                            {contact.isActive ? 'Active' : 'Resolved'}
                                        </span>
                                    </td>
                                    <td>
                                        {contact.interestUuid ? (
                                            <span className={`interest-badge ${contact.isDog ? 'dog-badge' : 'product-badge'}`}>
                                                {contact.isDog ? 'Dog' : 'Product'}
                                            </span>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            className="view-button"
                                            onClick={() => handleViewDetails(contact)}
                                        >
                                            View
                                        </button>
                                        {contact.isActive && (
                                            <button
                                                className="resolve-button"
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
                </div>
            )}

            {showDetails && selectedContact && (
                <div className="contact-details-overlay">
                    <div className="contact-details">
                        <h3>Contact Details</h3>

                        <div className="detail-row">
                            <span className="label">Name:</span>
                            <span className="value">{selectedContact.fullName}</span>
                        </div>

                        <div className="detail-row">
                            <span className="label">Email:</span>
                            <span className="value">{selectedContact.email}</span>
                        </div>

                        {selectedContact.phone && (
                            <div className="detail-row">
                                <span className="label">Phone:</span>
                                <span className="value">{selectedContact.phone}</span>
                            </div>
                        )}

                        {selectedContact.city && (
                            <div className="detail-row">
                                <span className="label">City:</span>
                                <span className="value">{selectedContact.city}</span>
                            </div>
                        )}

                        {selectedContact.state && (
                            <div className="detail-row">
                                <span className="label">State:</span>
                                <span className="value">{selectedContact.state}</span>
                            </div>
                        )}

                        <div className="detail-row">
                            <span className="label">Date:</span>
                            <span className="value">{formatDate(selectedContact.createdAt)}</span>
                        </div>

                        {selectedContact.interestUuid && (
                            <div className="interest-section">
                                <h4>Interest Information</h4>
                                {loadingInterestItem ? (
                                    <p>Loading interest item...</p>
                                ) : interestItem ? (
                                    <div className="interest-details">
                                        <div className="detail-row">
                                            <span className="label">Type:</span>
                                            <span className="value">
                                                {interestItem.type === 'storeItem' ? 'Product' : 'Dog'}
                                            </span>
                                        </div>

                                        {(interestItem.type !== 'dog' || (interestItem.data as Dog).name) && (
                                            <div className="detail-row">
                                                <span className="label">Name:</span>
                                                <span className="value">
                                                    {interestItem.type === 'dog'
                                                        ? `${(interestItem.data as Dog).sku}`
                                                        : String(interestItem.data.name)}
                                                </span>
                                            </div>
                                        )}

                                        {interestItem.type === 'storeItem' && (
                                            <>
                                                <div className="detail-row">
                                                    <span className="label">Category:</span>
                                                    <span className="value">
                                                        {String((interestItem.data as StoreItem).category)}
                                                    </span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="label">Price:</span>
                                                    <span className="value">
                                                        ${typeof (interestItem.data as StoreItem).price === 'number' ? (interestItem.data as StoreItem).price.toFixed(2) : '0.00'}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {interestItem.type === 'dog' && (
                                            <>
                                                <div className="detail-row">
                                                    <span className="label">Breed:</span>
                                                    <span className="value">
                                                        {typeof (interestItem.data as Dog).breed === 'string' ? (interestItem.data as Dog).breed : (interestItem.data as Dog).breed?.name || 'Unknown Breed'}
                                                    </span>
                                                </div>

                                                {(interestItem.data as Dog).gender && (
                                                    <div className="detail-row">
                                                        <span className="label">Gender:</span>
                                                        <span className="value">
                                                            {String((interestItem.data as Dog).gender)}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="detail-row">
                                                    <span className="label">Age:</span>
                                                    <span className="value">
                                                        {(interestItem.data as Dog).age} {(interestItem.data as Dog).age === 1 ? 'year' : 'years'}
                                                        {(interestItem.data as Dog).ageInMonths ? ` (${(interestItem.data as Dog).ageInMonths} months)` : ''}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span className="label">Price:</span>
                                                    <span className="value">
                                                        ${typeof (interestItem.data as Dog).price === 'number' ? ((interestItem.data as Dog).price || 0).toFixed(2) : '0.00'}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {(interestItem.type === 'storeItem' && (interestItem.data as StoreItem).description) ||
                                            (interestItem.type === 'dog' && (interestItem.data as Dog).additionalInfo) ? (
                                            <div className="detail-row">
                                                <span className="label">Description:</span>
                                                <span className="value">
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
                                            <div className="interest-image">
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

                        <div className="detail-actions">
                            {selectedContact.isActive && (
                                <button
                                    className="resolve-button"
                                    onClick={() => handleMarkResolved(selectedContact.id)}
                                >
                                    Mark as Resolved
                                </button>
                            )}
                            <button
                                className="close-button"
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