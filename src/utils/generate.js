// Hàm để tạo mã lớp
export const generateClassCode = (deliveryType, formatType, technicalGroup) => {
    const prefix = "EM"; 
    const delivery = deliveryType.toUpperCase();
    const format = formatType.toUpperCase();
    const technical = technicalGroup.toUpperCase();
    const year = new Date().getFullYear().toString().slice(-2); 
    const timestamp = Date.now(); 
    const number = timestamp.toString().slice(-2); 
    const classCode = `${prefix}.${delivery}_${technical}_${format}_${year}_${number}`;
    return classCode;
}
