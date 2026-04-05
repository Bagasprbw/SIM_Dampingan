import { getUser } from '../utils/storage';

// Custom hook untuk mendapatkan data user saat ini dari localStorage
export const useCurrentUser = () => {
    const user = getUser();
    return { user };
};
