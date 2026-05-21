import { useQuery } from '@tanstack/react-query';
import levelKegiatanService from '../../services/levelKegiatanService';
import { queryKeys } from '../../constants/queryKeys';

export const useLevelKegiatans = () => {
    return useQuery({
        queryKey: [queryKeys.LEVEL_KEGIATAN || 'level_kegiatan'],
        queryFn: () => levelKegiatanService.getAll(),
    });
};
