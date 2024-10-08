export const getUserInfo = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("No token found in localStorage.");
        return null;
    }

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1]; // Extract the payload
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Invalid token');
            return null;
        }
    }

    const tokenInfo = parseJwt(token);

    if (tokenInfo) {
        return {
            username: tokenInfo.sub,
            roles: tokenInfo.authorities ? tokenInfo.authorities.split(',') : [],
            expiration: new Date(tokenInfo.exp * 1000)
        };
    } else {
        console.log("Unable to parse token.");
        return null;
    }
};

// Example usage:
