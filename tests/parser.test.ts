import { describe, it, expect } from 'vitest';
import { extractNameAndParams, parseJsonSchema } from '../src/parser';

describe('Parser', () => {
    it('should extract name and params from path and method', () => {
        const result = extractNameAndParams('/api/v1/space/config', 'GET');
        console.log(result);
        expect(result).toEqual({ ...result, functionName: 'getSpaceConfig', interfaceName: 'GetSpaceConfig' });
    });

    it('should handle path with parameters', () => {
        const result = extractNameAndParams('/api/v1/user/{userId}/profile', 'GET');
        expect(result).toEqual({
            ...result,
            functionName: 'getUserProfile',
            interfaceName: 'GetUserProfile',
        });
    });

    it('should handle POST method correctly', () => {
        const result = extractNameAndParams('/api/v1/users/create', 'POST');
        expect(result).toEqual({
            ...result,
            functionName: 'postUsersCreate',
            interfaceName: 'PostUsersCreate',
        });
    });

    it('should handle multiple path parameters', () => {
        const result = extractNameAndParams('/api/v1/org/{orgId}/project/{projectId}', 'GET');
        expect(result).toEqual({
            ...result,
            functionName: 'getOrgProject',
            interfaceName: 'GetOrgProject',
        });
    });

    it('should handle underscore in path', () => {
        const result = extractNameAndParams('/api/v1/user_profile/settings', 'PUT');
        expect(result).toEqual({
            ...result,
            functionName: 'putUserProfileSettings',
            interfaceName: 'PutUserProfileSettings',
        });
    });

    it('should handle DELETE method with parameters', () => {
        const result = extractNameAndParams('/api/v1/project/{projectId}/member/{memberId}', 'DELETE');
        expect(result).toEqual({
            ...result,
            functionName: 'deleteProjectMember',
            interfaceName: 'DeleteProjectMember',
        });
    });
});
