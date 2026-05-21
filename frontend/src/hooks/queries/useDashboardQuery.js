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
