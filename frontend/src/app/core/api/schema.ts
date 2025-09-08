export interface paths {
    "/api/tasks/{taskId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["updateTask"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/tasks/{taskId}/assign": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["assignTaskToUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/tasks/project/{projectId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getProjectTasks"];
        put?: never;
        post: operations["createTask"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createProject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{projectId}/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getProjectMembers"];
        put?: never;
        post: operations["addMemberToProject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/tasks/{taskId}/details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getTask"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/{projectId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getProject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/projects/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getUserProjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        TaskUpdateDTO: {
            name?: string;
            description?: string;
            /** Format: date */
            dueDate?: string;
            /** Format: date */
            completedDate?: string;
            /** @enum {string} */
            status?: "TODO" | "DOING" | "DONE" | "BLOCKED";
            /** @enum {string} */
            priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
        };
        TaskCoreDTO: {
            /** Format: int64 */
            id?: number;
            name?: string;
            description?: string;
            /** Format: date */
            dueDate?: string;
            /** Format: date */
            completedDate?: string;
            /** @enum {string} */
            status?: "TODO" | "DOING" | "DONE" | "BLOCKED";
            /** @enum {string} */
            priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            /** Format: int64 */
            projectId?: number;
            /** Format: int64 */
            createdById?: number;
            createdByUsername?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        TaskAssignationDTO: {
            /** Format: int64 */
            taskId?: number;
            taskName?: string;
            /** Format: int64 */
            assigneeId?: number;
            assigneeUsername?: string;
            assigneeEmail?: string;
            /** Format: date-time */
            assignedAt?: string;
        };
        TaskCreateDTO: {
            name?: string;
            description?: string;
            /** Format: date */
            dueDate?: string;
            /** @enum {string} */
            status?: "TODO" | "DOING" | "DONE" | "BLOCKED";
            /** @enum {string} */
            priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
        };
        ProjectCreateDTO: {
            name?: string;
            description?: string;
            /** Format: date */
            startDate?: string;
        };
        ProjectCoreDTO: {
            /** Format: int64 */
            id?: number;
            name?: string;
            description?: string;
            /** Format: date */
            startDate?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        ProjectMembershipCreateDTO: {
            /** Format: int64 */
            projectId?: number;
            userEmail?: string;
            /** @enum {string} */
            role?: "ADMIN" | "MEMBER" | "VIEWER";
            /** Format: int64 */
            inviterId?: number;
        };
        ProjectMembershipCoreDTO: {
            /** Format: int64 */
            id?: number;
            /** Format: int64 */
            projectId?: number;
            projectName?: string;
            /** Format: int64 */
            userId?: number;
            username?: string;
            email?: string;
            /** @enum {string} */
            role?: "ADMIN" | "MEMBER" | "VIEWER";
            /** Format: int64 */
            invitedById?: number;
            invitedByUsername?: string;
            /** Format: date-time */
            invitedAt?: string;
            /** Format: date-time */
            acceptedAt?: string;
        };
        RegisterRequestBody: {
            email?: string;
            password?: string;
            username?: string;
        };
        UserCoreDTO: {
            /** Format: int64 */
            id?: number;
            username?: string;
            email?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        LoginRequestBody: {
            email?: string;
            password?: string;
        };
        TaskHistoryEntryDTO: {
            /** Format: int64 */
            id?: number;
            /** Format: int64 */
            taskId?: number;
            taskName?: string;
            field?: string;
            oldValue?: string;
            newValue?: string;
            /** Format: int64 */
            changedById?: number;
            changedByUsername?: string;
            /** Format: date-time */
            changedAt?: string;
        };
        TaskWithDetailsDTO: {
            /** Format: int64 */
            id?: number;
            name?: string;
            description?: string;
            /** Format: date */
            dueDate?: string;
            /** Format: date */
            completedDate?: string;
            /** @enum {string} */
            status?: "TODO" | "DOING" | "DONE" | "BLOCKED";
            /** @enum {string} */
            priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            /** Format: int64 */
            projectId?: number;
            /** Format: int64 */
            createdById?: number;
            createdByUsername?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            assignations?: components["schemas"]["TaskAssignationDTO"][];
            history?: components["schemas"]["TaskHistoryEntryDTO"][];
        };
        ProjectWithTasksDTO: {
            /** Format: int64 */
            id?: number;
            name?: string;
            description?: string;
            /** Format: date */
            startDate?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            tasks?: components["schemas"]["TaskCoreDTO"][];
        };
        ProjectOfUserDTO: {
            /** Format: int64 */
            id?: number;
            name?: string;
            description?: string;
            /** Format: date */
            startDate?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            membership?: components["schemas"]["ProjectMembershipCoreDTO"];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    updateTask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                taskId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TaskUpdateDTO"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TaskCoreDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    assignTaskToUser: {
        parameters: {
            query: {
                assigneeId: number;
            };
            header?: never;
            path: {
                taskId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TaskAssignationDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    getProjectTasks: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TaskCoreDTO"][];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    createTask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TaskCreateDTO"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TaskCoreDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    createProject: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProjectCreateDTO"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ProjectCoreDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    getProjectMembers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ProjectMembershipCoreDTO"][];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    addMemberToProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProjectMembershipCreateDTO"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ProjectMembershipCoreDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterRequestBody"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["UserCoreDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequestBody"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["UserCoreDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    getTask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                taskId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["TaskWithDetailsDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    getProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ProjectWithTasksDTO"];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    getUserProjects: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ProjectOfUserDTO"][];
                };
            };
            /** @description Any error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
}
