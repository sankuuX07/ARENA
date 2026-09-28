import { ProgressModuleId, ActivityType } from '../types';
export interface TestActivityOptions {
    module?: ProgressModuleId;
    activityType?: ActivityType;
    topic?: string;
    isCorrect?: boolean;
    score?: number;
    timeSpent?: number;
}
/**
 * Development test helper to record a sample activity and verify Progress Engine calculations
 */
export declare const recordSampleTestActivity: (uid: string, options?: TestActivityOptions) => unknown;
//# sourceMappingURL=testProgressHelper.d.ts.map