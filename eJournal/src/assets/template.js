// export const defaultAvatar = 'https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg';
export const img_dir = '../../../backend/images/';
export const backend = 'http://localhost:5174/';
export const O = '../../public/images/O.png';
export const X = '../../public/images/X.png';
export const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export async function getGroupData (groupName) {
    try {
        const groupDataResponse = await fetch(`${backend}get-group-data`, {
            method: 'GET',
            headers: {
                'table-name': groupName,
            },
        });
        
        const groupData = await groupDataResponse.json();

        return groupData;
    } catch (error) {
        console.error(error);
    }
};

/*
{
    "semester1": {
        "september": [
            {
                "day": 13,
                "present": false
            },
            {
                "day": 24,
                "present": false
            },
            {
                "day": 30,
                "present": false
            }
        ]
    }
}
*/
