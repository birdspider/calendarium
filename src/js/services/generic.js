/* generic endpoint */
export default function (callback) {
  return function (calendarium) {
    return callback(calendarium)
  }
}
