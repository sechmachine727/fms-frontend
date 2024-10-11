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
            return 'success' // Change color to green for active status
        case 'Assigned':
        case 'Reviewing':
            return 'warn' // Change color to red for inactive status
        default:
            return null
    }
}