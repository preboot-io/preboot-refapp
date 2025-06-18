import {TbBuilding, TbFileInvoice, TbHome2, TbUsers} from 'react-icons/tb';
import {UserAccountInfo} from "@/generated/models";

/*
    This is example code for a role-based routing system.
    Adjust the UserRole, Permission enums and roleConfigs to match your application's needs.
 */

export enum UserRole {
    SUPER_ADMIN = 'super-admin',
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
}

// Define common permissions
export enum Permission {
    VIEW_PRICE_REPORTS = 'can-see-price-reports',
    VIEW_ANALYTICS = 'can-see-analytics',
    MANAGE_USERS = 'can-manage-users',
    // Add more permissions as needed
}

export interface MenuItem {
    icon: typeof TbHome2;
    label: string;
    path: string;
    requiredPermissions?: Permission[]; // Optional permissions required to see this item
}

interface RoleConfig {
    defaultRoute: string;
    menuItems: MenuItem[];
}


// Role-specific configurations
export const roleConfigs: Record<UserRole, RoleConfig> = {
    [UserRole.SUPER_ADMIN]: {
        defaultRoute: '/super-admin/dashboard',
        menuItems: [
            {
                icon: TbHome2,
                label: 'layout.nav.home',
                path: '/super-admin/dashboard',
            },
            {
                icon: TbBuilding,
                label: 'features.tenants.title',
                path: '/super-admin/tenants',
            },
        ],
    },
    [UserRole.ADMIN]: {
        defaultRoute: '/admin/dashboard',
        menuItems: [
            {
                icon: TbHome2,
                label: 'layout.nav.home',
                path: '/admin/dashboard',
            },
            {
                path: '/admin/invoices',
                label: 'Invoices', // TODO: localize this
                icon: TbFileInvoice
            },
            {
                path: '/admin/users',
                label: 'features.users.title',
                icon: TbUsers
            }
        ],
    },
    [UserRole.CLIENT]: {
        defaultRoute: '/dashboard',
        menuItems: [
            {
                icon: TbHome2,
                label: 'layout.nav.home',
                path: '/dashboard',
            }
        ],
    },
};

export function getDefaultRouteForUser(userRoles: string[]): string {
    const priorityOrder: UserRole[] = [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.CLIENT,
    ];

    const highestPriorityRole = priorityOrder.find(role =>
        userRoles.includes(role)
    );

    return highestPriorityRole
        ? roleConfigs[highestPriorityRole].defaultRoute
        : '/dashboard';
}

export function getMenuItemsForUser(user: UserAccountInfo): MenuItem[] {
    const priorityOrder: UserRole[] = [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.CLIENT,
    ];

    const highestPriorityRole = priorityOrder.find(role =>
        user.roles?.includes(role)
    ) as UserRole;

    if (!highestPriorityRole) {
        return [];
    }

    // Get menu items for that role
    const menuItems = roleConfigs[highestPriorityRole].menuItems;

    // Filter items based on permissions and customPermissions
    return menuItems.filter(item => {
        if (!item.requiredPermissions) {
            return true;
        }

        return item.requiredPermissions.every(permission =>
            user.permissions?.includes(permission) || user.customPermissions?.includes(permission)
        );
    });
}
