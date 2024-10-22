// Hàm để tạo mã lớp
export const generateClassCode = (deliveryType, formatType, technicalGroup, groups) => {
  console.log(groups)
  const prefix = 'EM'
  const delivery = deliveryType.toUpperCase()
  const format = formatType.toUpperCase()
  const technical = technicalGroup.toUpperCase()
  const year = new Date().getFullYear().toString().slice(-2)
  let counter = 1
  let classCode = `${prefix}.${delivery}_${technical}_${format}_${year}_${counter}`
  while (groups.filter((group) => group.groupCode === classCode).length > 0) {
    counter++
    classCode = `${prefix}.${delivery}_${technical}_${format}_${year}_${counter}`
  }

  return classCode
}
