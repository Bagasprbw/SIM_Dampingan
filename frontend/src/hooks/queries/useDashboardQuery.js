import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboardService';
import { queryKeys } from '../../constants/queryKeys';

export const useDashboardFasilitator = ({ enabled = true } = {}) => {
    return useQuery({
        queryKey: [queryKeys.DASHBOARD_FASILITATOR],
        queryFn: () => dashboardService.getFasilitator(),
        enabled,
    });
};

export const useDashboardAdmin = ({ enabled = true } = {}) => {
    return useQuery({
        queryKey: [queryKeys.DASHBOARD_ADMIN],
        queryFn: () => dashboardService.getAdmin(),
        enabled,
    });
};

export const useDashboardPjDampingan = ({ enabled = true } = {}) => {
    return useQuery({
        queryKey: [queryKeys.DASHBOARD_PJ_DAMPINGAN],
        queryFn: () => dashboardService.getPjDampingan(),
        enabled,
    });
};
