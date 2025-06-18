# RefApp Frontend Documentation

## Overview

RefApp Frontend is a SaaS starter kit built with React, TypeScript, and Mantine UI. It provides a solid foundation for building modern web applications with features like:

- Role-based authentication and authorization
- Multi-tenant support
- Internationalization
- Modular architecture
- Comprehensive UI component library
- Type-safe API integration

## Tech Stack

- **React 19** (React 18 compatible)
- **TypeScript** for type safety
- **Mantine UI v8** for component library
- **React Query** for server state management
- **React Router 7** for routing
- **Axios** for API requests
- **react-icons** (Tabler Icons) for iconography
- **CSS Modules** for component-scoped styling
- **i18next** for internationalization

## Project Structure

```
src/
├── features/           # Feature-based code organization
│   ├── auth/          # Authentication feature
│   └── invoices/      # Example business feature
├── pages/             # Route components by access level
├── components/        # Shared components
├── config/           # Application configuration
├── i18n/             # Internationalization
├── utils/            # Utility functions
├── providers/        # React providers/contexts
└── theme/            # Theme configuration
```

### Key Directories

- `features/`: Contains feature modules, each with its own:
    - `api/`: API integration
    - `components/`: Feature-specific components
    - `hooks/`: Custom React hooks
    - `types/`: TypeScript definitions

- `pages/`: Organized by access level:
    - `public/`: Unauthenticated pages
    - `admin/`: Admin-only pages
    - `super-admin/`: Super admin pages

## Authentication & Authorization

### Role-Based Access Control

The application uses a comprehensive role-based access control system:

```typescript
export enum UserRole {
    SUPER_ADMIN = 'super-admin',
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
}
```

Protected routes are wrapped with the `RequireAuth` component:

```typescript
<Route
    path="/admin/*"
    element={
        <RequireAuth roles={[UserRole.ADMIN]}>
            <Outlet/>
        </RequireAuth>
    }
>
```

### Multi-tenant Support

The application includes built-in multi-tenant support with:
- Tenant switching functionality
- Tenant-specific data isolation
- Tenant context management

## Key Components

### DataTable

The `DataTable` component from `@preboot.io/preboot-ui-community` provides a comprehensive solution for displaying tabular data with advanced features. Here's a detailed guide using the Invoices feature as a practical example.

#### Core Features

- Sortable columns
- Text and enum filters
- Server-side pagination
- Customizable row actions
- Loading states with skeletons
- Custom cell rendering
- Search functionality

#### Basic Implementation

```typescript
import { DataTable, Column, TableData } from "@preboot.io/preboot-ui-community";
import { Invoice } from '@/generated/models';

const columns: Column<Invoice>[] = [
    {
        key: 'invoiceNumber',
        label: 'Invoice Number',
        sortable: true,
        filterable: true,
        filterType: 'text'
    }
];

<DataTable
    data={data}
    columns={columns}
    loading={isLoading}
    onParamsChange={setParams}
    currentParams={params}
    rowActions={actions}
/>
```

#### Advanced Column Configuration

```typescript
const columns = [
    // Text filter with sorting
    {
        key: 'invoiceNumber',
        label: 'Invoice Number',
        sortable: true,
        filterable: true,
        filterType: 'text'
    },
    
    // Custom value rendering
    {
        key: 'totalAmount',
        label: 'Amount',
        sortable: true,
        render: (value: number) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        }
    },
    
    // Enum filter with custom rendering
    {
        key: 'status',
        label: 'Status',
        filterable: true,
        filterType: 'enum',
        filterOptions: [
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Issued', value: 'ISSUED' },
            { label: 'Paid', value: 'PAID' },
            { label: 'Cancelled', value: 'CANCELLED' },
        ],
        render: (value: string) => (
            <Badge color={getStatusColor(value)} variant="light">
                {value}
            </Badge>
        ),
    }
] as const;
```

#### Row Actions Implementation

```typescript
const rowActions: RowAction<Invoice>[] = [
    {
        label: 'Edit',
        icon: TbEdit,
        onClick: handleEditClick
    },
    {
        label: 'Delete',
        icon: TbTrash,
        color: 'red',
        onClick: handleDeleteClick
    }
];
```

#### Search Parameters Management

```typescript
const [queryParams, setQueryParams] = useState(
    createSearchRequest(0, 10, 'invoiceNumber')
);

// Integration with React Query
const { data, isLoading } = useQuery({
    queryKey: ['invoices', queryParams],
    queryFn: () => invoicesApi.getInvoices(queryParams),
});
```

#### Filter Types

1. **Text Filter**
```typescript
{
    key: 'name',
    filterable: true,
    filterType: 'text'
}
```

2. **Enum Filter**
```typescript
{
    key: 'status',
    filterable: true,
    filterType: 'enum',
    filterOptions: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' }
    ]
}
```

#### Search Request Helper

```typescript
import { createSearchRequest } from "@preboot.io/preboot-ui-community";

const initialParams = createSearchRequest(
    0,              // page
    10,             // pageSize
    'invoiceNumber', // sortField
    'ASC',          // sortDirection
    []              // initial filters
);
```

### BaseForm

The `BaseForm` component simplifies form creation with Mantine Forms:

```typescript
interface FormData {
    name: string;
}

const form = useForm<FormData>({
    initialValues: { name: '' }
});

<BaseForm
    form={form}
    onSubmit={handleSubmit}
    loading={isSubmitting}
>
    <TextField
        form={form}
        name="name"
        label="Name"
    />
</BaseForm>
```

## API Integration

### Setting up Orval

1. Install Orval:
```bash
npm install orval --save-dev
```

2. Create `orval.config.js`:
```javascript
module.exports = {
    api: {
        input: {
            target: 'http://your-api-url/v3/api-docs',
        },
        output: {
            mode: 'tags-split',
            target: './src/generated/api',
            schemas: './src/generated/models',
            client: 'react-query',
            override: {
                mutator: {
                    path: './src/utils/axios.ts',
                    name: 'axiosInstanceFunc'
                }
            }
        }
    }
};
```

3. Generate API client:
```bash
npx orval
```

### Using Generated API Clients

The generated API clients integrate with React Query:

```typescript
import { useQuery } from '@tanstack/react-query';
import { getInvoiceController } from '@/generated/api';

function useInvoices() {
    return useQuery({
        queryKey: ['invoices'],
        queryFn: () => getInvoiceController().getAll()
    });
}
```

## Styling Guidelines

### Theme Configuration

Use Mantine's theme system for consistent styling:

```typescript
export const theme = createTheme({
    primaryColor: 'blue',
    defaultRadius: 'md',
    components: {
        Paper: {
            defaultProps: {
                p: 'lg',
                shadow: 'sm',
            },
        }
    }
});
```

### CSS Modules

Use CSS Modules for component-specific styles:

```css
/* component.module.css */
.container {
    background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
}
```

```typescript
import classes from './component.module.css';

export function Component() {
    return <div className={classes.container} />;
}
```

## Creating New Features and Pages

The application follows a feature-first architecture where each feature is self-contained within the `features/` directory. Let's walk through creating a new feature using the Invoices feature as an example.

### Feature Structure

```
features/
└── invoices/
    ├── api/
    │   └── invoices-service.ts      # API integration
    ├── components/
    │   ├── invoice-form.tsx         # Reusable form component
    │   ├── invoice-form-modal.tsx   # Modal wrapper
    │   └── invoice-list.tsx         # List component
    ├── hooks/
    │   ├── use-invoices.ts          # Data fetching hooks
    │   └── use-invoice-mutations.ts  # Mutation hooks
    └── types/
        └── invoice-form-types.ts    # Feature-specific types
```

### 1. Create API Integration

```typescript
// features/invoices/api/invoices-service.ts
import { Invoice, PageInvoice } from '@/generated/models';
import { getInvoiceController } from "@models/invoice-controller/invoice-controller";

export const invoicesApi = {
    getInvoices: async (params: SearchParams): Promise<PageInvoice> => {
        return getInvoiceController().searchWithBody(params);
    },
    
    create: async (data: InvoiceFormValues): Promise<Invoice> => {
        return getInvoiceController().create(data);
    },
    // ...other API methods
};
```

### 2. Create Feature Components

```typescript
// features/invoices/components/invoice-form.tsx
export function InvoiceForm({ initialData, onSubmit }: InvoiceFormProps) {
    const form = useForm<InvoiceFormValues>({
        initialValues: {
            issueDate: initialData?.issueDate || new Date(),
            // ...other fields
        },
        validate: {
            // validation rules
        }
    });

    return (
        <BaseForm form={form} onSubmit={onSubmit}>
            <DatePickerInput
                label="Issue Date"
                {...form.getInputProps('issueDate')}
            />
            {/* other form fields */}
        </BaseForm>
    );
}
```

### 3. Create Page Component

```typescript
// pages/admin/invoices/invoices-page.tsx
export function InvoicesPage() {
    const [queryParams, setQueryParams] = useState(
        createSearchRequest(0, 10, 'invoiceNumber')
    );

    const { data, isLoading } = useQuery({
        queryKey: ['invoices', queryParams],
        queryFn: () => invoicesApi.getInvoices(queryParams),
    });

    return (
        <div>
            <Group justify="space-between" mb="lg">
                <Title order={2}>Invoices</Title>
                <Button
                    leftSection={<TbFileInvoice />}
                    onClick={handleCreate}
                >
                    Create Invoice
                </Button>
            </Group>

            <DataTable
                data={data}
                columns={columns}
                loading={isLoading}
                onParamsChange={setQueryParams}
                currentParams={queryParams}
                rowActions={rowActions}
            />
            
            {/* Modals and other UI components */}
        </div>
    );
}
```

### 4. Configure Role-Based Routes

The application uses a centralized role configuration system in `role-routes.ts`:

```typescript
// config/role-routes.ts
export enum UserRole {
    SUPER_ADMIN = 'super-admin',
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
}

interface MenuItem {
    icon: typeof TbHome2;
    label: string;
    path: string;
    requiredPermissions?: Permission[];
}

interface RoleConfig {
    defaultRoute: string;
    menuItems: MenuItem[];
}

export const roleConfigs: Record<UserRole, RoleConfig> = {
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
                label: 'Invoices',
                icon: TbFileInvoice,
                requiredPermissions: [Permission.VIEW_INVOICES]
            },
        ],
    },
    // ... other role configurations
};
```

### 5. Add Route to App.tsx

```typescript
// App.tsx
<Routes>
    {/* Protected routes */}
    <Route
        element={
            <RequireAuth>
                <AppLayout/>
            </RequireAuth>
        }
    >
        {/* Admin only routes */}
        <Route
            path="/admin/*"
            element={
                <RequireAuth roles={[UserRole.ADMIN]}>
                    <Outlet/>
                </RequireAuth>
            }
        >
            <Route path="invoices" element={<InvoicesPage/>}/>
        </Route>
    </Route>
</Routes>
```

### 6. Add Translations

```typescript
// i18n/locales/en.ts
export const en = {
    features: {
        invoices: {
            title: 'Invoices',
            create: 'Create Invoice',
            fields: {
                issueDate: 'Issue Date',
                dueDate: 'Due Date',
                amount: 'Amount'
            },
            // ... other translations
        }
    }
};
```

### Role-Based Route Configuration

#### Permission Management

```typescript
export enum Permission {
    VIEW_INVOICES = 'view-invoices',
    MANAGE_INVOICES = 'manage-invoices',
    VIEW_REPORTS = 'view-reports',
    // ... other permissions
}
```

#### Menu Configuration

Menu items can be conditional based on permissions:

```typescript
const menuItems: MenuItem[] = [
    {
        icon: TbFileInvoice,
        label: 'Invoices',
        path: '/admin/invoices',
        requiredPermissions: [Permission.VIEW_INVOICES]
    }
];
```

#### Route Priority

The system handles users with multiple roles using priority order:

```typescript
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
```

### Best Practices

1. **Feature Organization**
    - Keep all feature-related code in the feature directory
    - Create reusable components within the feature
    - Use hooks for common logic
    - Define clear types and interfaces

2. **Page Components**
    - Pages should be thin and mainly compose feature components
    - Handle routing and high-level state management
    - Implement role-based access control

3. **Role Configuration**
    - Define clear role hierarchies
    - Use permissions for granular access control
    - Keep menu items in sync with routes
    - Consider user experience for multi-role users

## Best Practices

1. **Feature Organization**
    - Keep feature-specific code within feature directories
    - Share common components through `components/` directory
    - Use hooks for reusable logic

2. **Type Safety**
    - Use TypeScript strictly
    - Leverage generated API types
    - Define clear interfaces for component props

3. **State Management**
    - Use React Query for server state
    - Use React Context for global app state
    - Keep component state local when possible

4. **Styling**
    - Use Mantine theme variables
    - Avoid inline styles
    - Use CSS Modules for component-specific styles

5. **Authentication**
    - Always wrap protected routes with `RequireAuth`
    - Handle token refresh automatically
    - Manage permissions at both route and UI levels

## Common Components Usage

### TextField

```typescript
<TextField
    form={form}
    name="fieldName"
    label="Field Label"
    required
    mode="edit" // or "readonly"
/>
```

### SelectField

```typescript
<SelectField
    form={form}
    name="status"
    label="Status"
    data={[
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ]}
/>
```

### MultiSelectField

```typescript
<MultiSelectField
    form={form}
    name="roles"
    label="Roles"
    data={roles}
    displayBadges
/>
```

## Development Workflow

1. **Starting Development**
```bash
npm install
npm run dev
```

2. **Generating API Clients**
```bash
npm run generate-api
```

3. **Building for Production**
```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **API Generation Fails**
    - Ensure API server is running
    - Check Orval configuration
    - Verify API endpoint accessibility

2. **Authentication Issues**
    - Check token storage
    - Verify API endpoints
    - Review role configurations

3. **Styling Problems**
    - Confirm Mantine theme setup
    - Check CSS Module imports
    - Review component style overrides

## Internationalization (i18n)

The application uses `i18next` for internationalization support. The implementation is organized to support multiple languages and feature-based translation organization.

### Directory Structure

```
src/
└── i18n/
    ├── locales/
    │   └── en.ts    # English translations
    └── i18n.ts      # i18n configuration
```

### Configuration Setup

```typescript
// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en
            }
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });
```

### Translation Structure

Translations are organized by features and components:

```typescript
// src/i18n/locales/en.ts
export const en = {
    common: {
        errors: {
            invalidEmail: 'Invalid email',
            required: 'This field is required'
        },
        buttons: {
            submit: 'Submit',
            cancel: 'Cancel'
        }
    },
    auth: {
        login: {
            title: 'Welcome!',
            subtitle: 'Enter your credentials'
        },
        forgotPassword: {
            title: 'Reset Password',
            success: 'Instructions sent to your email'
        }
    },
    features: {
        invoices: {
            title: 'Invoices',
            status: {
                draft: 'Draft',
                issued: 'Issued'
            }
        }
    }
};
```

### Usage in Components

1. **Basic Translation**
```typescript
import { useTranslation } from 'react-i18next';

export function MyComponent() {
    const { t } = useTranslation();
    
    return (
        <Title>{t('auth.login.title')}</Title>
    );
}
```

2. **With Variables**
```typescript
// Using variables in translations
t('common.welcome', { name: user.name })

// In translation file
{
    "common.welcome": "Welcome, {{name}}!"
}
```

3. **In Form Labels**
```typescript
<TextField
    label={t('features.invoices.fields.number')}
    placeholder={t('features.invoices.placeholders.number')}
/>
```

### Best Practices

1. **Translation Keys**
    - Use nested structures for better organization
    - Group by feature/module
    - Use consistent naming patterns

2. **Dynamic Content**
    - Use interpolation for dynamic values
    - Handle pluralization when needed
    - Consider text length variations in UI design

3. **Maintenance**
    - Keep translations in sync across languages
    - Document special formatting or variables
    - Consider using TypeScript for type-safe translations

### Adding a New Language

1. Create a new locale file:
```typescript
// src/i18n/locales/de.ts
export const de = {
    common: {
        // German translations
    }
};
```

2. Update i18n configuration:
```typescript
i18n.init({
    resources: {
        en: { translation: en },
        de: { translation: de }
    },
    lng: 'en',
    fallbackLng: 'en'
});
```
