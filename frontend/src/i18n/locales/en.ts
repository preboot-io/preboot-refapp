// src/i18n/locales/en.ts
export const en = {
    common: {
        errors: {
            invalidEmail: 'Invalid email',
            passwordTooShort: 'Password must be at least 6 characters',
            invalidCredentials: 'Invalid email or password',
            serverError: 'An error occurred',
        },
        buttons: {
            signIn: 'Sign in',
            back: 'Back',
            submit: 'Submit',
            update: 'Update',
            create: 'Create'
        },
        dataTable: {
            addFilter: 'Add filter',
            noRecordsFound: 'No records found',
            totalItems: "Total items",
            export: 'Export',
            exportAs: 'Export as'
        },
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        dataLoadError: 'Cannot load data',
        yes: 'Yes',
        no: 'No',
        notProvided: 'Not provided',
        id: 'ID',
        uuid: 'UUID',
        createdAt: 'Created at',
        updatedAt: 'Updated at',
        back: 'Back',
        selectAll: 'Select all',
        deselectAll: 'Deselect all',
        close: 'Close',
        status: {
            label: 'Status',
            active: 'Active',
            inactive: 'Inactive',
        },
        roles: {
            client: 'User',
            admin: 'Admin',
            superAdmin: 'Technical Admin'
        },
        create: 'Create',
        update: 'Update',
        edit: 'Edit',
        cancel: 'Cancel',
    },
    features: {
        users: {
            title: 'User Management',
            createButton: 'Create User',
            addUser: 'Add User',
            status: {
                active: 'Active',
                inactive: 'Inactive'
            },
            actions: {
                editRoles: 'Edit Roles',
                delete: 'Delete User'
            },
            form: {
                username: 'Full Name',
                usernamePlaceholder: 'Enter user\'s full name',
                email: 'Email',
                emailPlaceholder: 'Enter user\'s email',
                roles: 'Roles',
                rolesPlaceholder: 'Select user roles',
                errors: {
                    usernameRequired: 'Name is required',
                    rolesRequired: 'At least one role is required'
                }
            },
            modal: {
                createTitle: 'Create New User',
                editTitle: 'Edit User Roles'
            },
            delete: {
                confirmTitle: 'Delete User',
                confirmMessage: 'Are you sure you want to delete {{username}}? This action cannot be undone.'
            },
            noUsers: {
                title: 'No Users Found',
                message: 'There are no users in this tenant yet.'
            },
            notifications: {
                created: 'User created successfully',
                rolesUpdated: 'User roles updated successfully',
                removed: 'User removed successfully',
                createError: 'Failed to create user',
            },
            table: {
                columns: {
                    username: 'Name',
                    email: 'Email',
                    status: 'Status',
                    roles: 'Roles'
                }
            },
            roles: {
                ADMIN: 'Admin',
                USER: 'User'
            },
            fields: {
                username: 'Username',
                email: 'Email',
                status: 'Status',
                roles: 'Roles',
            },
            placeholders: {
                username: 'Enter username',
                email: 'Enter email',
                roles: 'Select roles'
            },
        },
        tenants: {
            title: 'Tenants',
            createTenant: 'Create Tenant',
            editTenant: 'Edit Tenant',
            createSuccess: 'Tenant created successfully',
            createError: 'Failed to create tenant',
            manageRoles: 'Manage Roles for {{tenant}}',
            scopePermissions: 'Scope Permissions',
            placeholders: {
                name: 'Enter tenant name',
            },
            actions: {
                viewUsers: 'View Users',
                manageRoles: 'Manage Roles',
            },
            fields: {
                name: 'Tenant Name',
                roles: 'Tenant Roles',
            },
        }
    },
    auth: {
        login: {
            title: 'Welcome!',
            subtitle: 'Enter your credentials to access your account',
            email: 'Email',
            password: 'Password',
            rememberMe: 'Remember me',
            forgotPassword: 'Forgot password?',
            createAccount: 'Create an account',
        },
        forgotPassword: {
            title: 'Reset Password',
            subtitle: 'Enter your email to reset your password',
            success: 'If an account exists for this email, you will receive password reset instructions.',
            backToLogin: 'Back to login',
            sendInstructions: 'Send Reset Instructions',
        },
        resetPassword: {
            title: 'Reset Password',
            subtitle: 'Enter your new password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            passwordMismatch: 'Passwords do not match',
            success: 'Your password has been successfully reset!',
            goToLogin: 'Go to Login',
            invalidLink: 'Invalid reset link. Please request a new password reset.',
        },
        register: {
            title: 'Create New Account',
            subtitle: 'Register your organization and account',
            organizationName: 'Organization Name',
            organizationNamePlaceholder: 'Enter your organization name',
            username: 'Full Name',
            usernamePlaceholder: 'Enter your full name',
            email: 'Email',
            submit: 'Register',
            backToLogin: 'Back to Login',
            successTitle: 'Registration Successful',
            successMessage: 'Thank you for registering! Please check your email for an activation link to complete your registration (unless you account was already in the system).',
            registrationDisabled: 'Registration is currently disable',
        },
        activation: {
            title: 'Activate Your Account',
            subtitle: 'Please set your password to activate your account',
            password: {
                label: 'Password',
                placeholder: 'Enter your password',
                requirements: 'Password must be at least 8 characters long'
            },
            confirmPassword: {
                label: 'Confirm Password',
                placeholder: 'Confirm your password',
                mismatch: 'Passwords do not match'
            },
            submit: 'Activate Account',
            success: {
                title: 'Account Activated',
                message: 'Your account has been successfully activated. You can now login.',
                redirectMessage: 'You will be redirected to the login page.'
            },
            errors: {
                missingToken: {
                    title: 'Invalid Request',
                    message: 'Activation token is missing'
                },
                invalidToken: {
                    title: 'Invalid Token',
                    message: 'The activation token is invalid or has expired'
                },
                alreadyActivated: {
                    title: 'Already Activated',
                    message: 'This account has already been activated'
                },
                serverError: {
                    title: 'Activation Failed',
                    message: 'An error occurred while activating your account'
                }
            }
        },
        account: {
            accountType: 'Account Type',
            demoAccount: 'Demo Account',
            paidAccount: 'Paid Account',
        }
    },
    dashboard: {
        title: 'Dashboard',
        stats: {
            totalUsers: 'Total Users',
            activeProjects: 'Active Projects',
            revenue: 'Revenue',
            growth: 'Growth'
        }
    },
    layout: {
        nav: {
            home: 'Home',
            logout: 'Logout',
        },
        header: {
            greeting: 'Hi, {{username}}'
        }
    }
};
