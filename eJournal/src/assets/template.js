// export const defaultAvatar = 'https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg';
export const img_dir = '../../../backend/images/';
export const backend = 'http://localhost:5174/';
export const O = '../../public/images/O.png';
export const X = '../../public/images/X.png';

export const findStudent = (students, fName, lName) => {
    return (students.findIndex(item => item.fName === fName && lName === item.lName), students);
}
