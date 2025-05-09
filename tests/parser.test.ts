import { describe, it, expect } from 'vitest';
import { extractNameAndParams } from '../src/parser';

describe('Parser', () => {
    it('should extract name and params from path and method', () => {
        const result = extractNameAndParams('/api/v1/space/config', 'GET', []);
        expect(result).toEqual({ ...result, functionName: 'getApiV1SpaceConfig', interfaceName: 'GetApiV1SpaceConfig' });
    });

    it('should handle path with parameters', () => {
        const result = extractNameAndParams('/api/v1/user/{userId}/profile', 'GET', []);
        expect(result).toEqual({
            ...result,
            functionName: 'getApiV1UserProfileByUserId',
            interfaceName: 'GetApiV1UserProfileByUserId',
        });
    });

    it('should handle POST method correctly', () => {
        const result = extractNameAndParams('/api/v1/users/create', 'POST', []);
        expect(result).toEqual({
            ...result,
            functionName: 'postApiV1UsersCreate',
            interfaceName: 'PostApiV1UsersCreate',
        });
    });

    it('should handle multiple path parameters', () => {
        const result = extractNameAndParams('/api/v1/org/{orgId}/project/{projectId}', 'GET', []);
        expect(result).toEqual({
            ...result,
            functionName: 'getApiV1OrgProjectByOrgIdByProjectId',
            interfaceName: 'GetApiV1OrgProjectByOrgIdByProjectId',
        });
    });

    it('should handle underscore in path', () => {
        const result = extractNameAndParams('/api/v1/user_profile/settings', 'PUT', []);
        expect(result).toEqual({
            ...result,
            functionName: 'putApiV1UserProfileSettings',
            interfaceName: 'PutApiV1UserProfileSettings',
        });
    });

    it('should handle DELETE method with parameters', () => {
        const result = extractNameAndParams('/api/v1/project/{projectId}/member/{memberId}', 'DELETE', []);
        expect(result).toEqual({
            ...result,
            functionName: 'deleteApiV1ProjectMemberByProjectIdByMemberId',
            interfaceName: 'DeleteApiV1ProjectMemberByProjectIdByMemberId',
        });
    });

    it('should handle path with underscore in path', () => {
        const result = extractNameAndParams('/svc/api/v1/project/{project_id}/subsystems', 'GET', []);
        expect(result).toEqual({
            ...result,
            functionName: 'getSvcApiV1ProjectSubsystemsByProjectId',
            interfaceName: 'GetSvcApiV1ProjectSubsystemsByProjectId',
        });
    });

    it('should handle path with dash in path', () => {
        const result = extractNameAndParams('/api/trace_matrix/resourceuse+-upload', 'POST', []);
        expect(result).toEqual({
            ...result,
            functionName: 'postApiTraceMatrixResourceuseUpload',
            interfaceName: 'PostApiTraceMatrixResourceuseUpload',
        });
    });
});


