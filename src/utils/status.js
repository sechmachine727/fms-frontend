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
       case 'Active':
            return 'success'
        case 'Inactive':
            return 'warn'
        case 'Declined':
            return 'danger'
        case 'Reviewing':
            return 'info'
        default:
            return null
    }
}