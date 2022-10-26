const url = 'https://firebasestorage.googleapis.com/v0/b/been-there-22346.appspot.com/o/slhxUjl8rB2mrdD6FBKz%2FIMG_20170923_153707.jpg?alt=media&token=d7022629-d4be-4675-bb48-fc7b378ecd4e'
const regex = /%(.*?)\?/

const [full, match] = url.match(regex) || []

console.log('match', match)
console.log('full', full)