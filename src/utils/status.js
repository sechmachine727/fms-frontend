// Hàm để tạo mã lớp
export const getStatusArray = () => {
    return [
        { id: "PLANNING", name: 'Planning' },
        { id: "ASSIGNED", name: 'Assigned' },
        { id: "REVIEWING", name: 'Reviewing' },
        { id: "CANCELLED", name: 'Cancelled' },
        { id: "DECLINED", name: 'Declined' },
        { id: "IN_PROGRESS", name: 'In Progress ' },
        { id: "PENDING_CLOSE", name: 'Pending Close' },
        { id: "CLOSED", name: 'Closed' },
    ];
};

export const getStatusLabel = (status) => {
    switch (status) {
    case 'Planning':
            return 'secondary'
    case 'In progress':
    case 'Active':
            return 'success'
    case 'Inactive':
    case 'Assigned':
            return 'warn'
    case 'Declined':
            return 'danger'
    case 'Reviewing':
            return 'info'
    default:
            return null
    }
}