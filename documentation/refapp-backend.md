# Refapp Developer Guide

## Overview

Refapp is a Spring Boot-based SaaS kickstarter application that leverages the Preboot.io Community library to provide a robust foundation for building multi-tenant SaaS applications. This guide will help you understand the project structure, key components, and how to implement features effectively.

## Project Architecture

### PreBoot Integration

Refapp integrates several key modules from the PreBoot.io:

1. **preboot-auth**: Authentication and authorization
    - Multi-tenant user management
    - JWT-based authentication
    - Role-based access control

2. **preboot-securedata**: Data access security
    - Tenant isolation
    - Row-level security
    - Automatic tenant context management

3. **preboot-query**: Advanced querying capabilities
    - Dynamic filtering
    - Pagination
    - Sorting

4. **preboot-eventbus**: Event-driven architecture
    - Synchronous and asynchronous event handling
    - Task scheduling and management
    - Event persistence

5. **preboot-notifications**: Communication services
    - Email notifications
    - WebSocket support
    - Template-based messaging

## Project Structure

```
io.preboot.refapp/
├── config/              # Configuration classes
├── exception/           # Global exception handling
├── feature/             # Feature modules
│   └── invoice/         # Example feature
│       ├── dto/         # Data transfer objects
│       ├── model/       # Domain models
│       ├── repository/  # Data access layer
│       └── rest/        # REST controllers
├── globalEventHandlers/   # Application-wide event handlers
└── ReferenceApplication.java
```

### Key Configuration Files

- `application.yml`: Main configuration file
- `db/changelog/`: Liquibase change logs
- Configuration classes in `config/` package:
    - `EventBusConfig.java`: Event handling setup
    - `SecurityContextProviderService.java`: Security context management
    - `WebSocketConfig.java`: WebSocket configuration
    - And more...

## Implementing Features

### Feature Structure
Each feature should follow this structure:
```
feature/
└── yourfeature/
    ├── dto/          # Request/Response objects
    ├── model/        # Domain entities
    ├── repository/   # Data access
    └── rest/         # REST endpoints
```

### Step-by-Step Guide

1. **Create Domain Model**
```java
@Table("your_table")
@Data
public class YourEntity {
    @Id
    private Long id;

    @Tenant
    private UUID tenantId;  // Required for multi-tenancy

    private String name;
    
    @Version
    private Long version;   // Optimistic locking
}
```

2. **Create Repository**
```java
@Repository
public interface YourRepository extends SecureRepository<YourEntity, Long> {
    // Custom query methods
}

@Repository
public class YourRepositoryImpl extends SecureRepositoryImpl<YourEntity, Long> {
    protected YourRepositoryImpl(SecureRepositoryContext context) {
        super(context, YourEntity.class);
    }
}
```

3. **Create Controller**
```java
@RestController
@RequestMapping("/api/your-feature")
public class YourController extends CrudFilterableController<YourEntity, Long> {
    private final YourRepository repository;

    public YourController(YourRepository repository) {
        super(repository);
        this.repository = repository;
    }
}
```

4. **Add Database Schema Changes**
   Create a new changelog file in `db/changelog/`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                   http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.4.xsd">

    <changeSet id="create-your-table" author="you">
        <createTable tableName="your_table">
            <column name="id" type="bigint" autoIncrement="true">
                <constraints primaryKey="true"/>
            </column>
            <column name="tenant_id" type="uuid">
                <constraints nullable="false"/>
            </column>
            <column name="name" type="varchar(255)"/>
            <column name="version" type="bigint"/>
        </createTable>
    </changeSet>
</databaseChangeLog>
```

### Using Toolbox Features

#### Secure Data Access
```java
@SecureEntity
@Table("your_table")
public class YourEntity {
    @Tenant
    private UUID tenantId;  // Automatic tenant isolation
}
```

#### Dynamic Filtering
```java
SearchParams params = SearchParams.criteria(
    FilterCriteria.eq("status", "ACTIVE"),
    FilterCriteria.gt("amount", 100)
).build();

Page<YourEntity> results = repository.findAll(params);
```

#### Event Handling
```java
@Component
public class YourEventHandler {
    @EventHandler
    public void handleEvent(YourEvent event) {
        // Handle the event
    }
}
```

## Security Considerations

### Multi-tenancy
- Every entity should include `@Tenant private UUID tenantId`
- Use `SecureRepository` for automatic tenant isolation
- Always extend `SecureRepositoryImpl` for custom implementations

### Authentication
- JWT-based authentication is configured by default
- Custom endpoints can be made public in `application.yml`
- Use `@SecureAccess` for role-based access control

## Database Management

### Liquibase Usage
1. Create new changelog files in `db/changelog/`
2. Register them in `db.changelog-master.xml`
3. Follow naming convention: `YYYYMMDD_feature_description.xml`
4. Always include rollback instructions

### Spring Data JDBC
- Prefer Spring Data JDBC over JPA for simplicity
- Use `@Table` and `@Column` annotations
- Implement optimistic locking with `@Version`

## Testing

### Test Structure
```java
@SpringBootTest
@Import({TestSecurityConfig.class})
class YourFeatureTest {
    @Autowired
    private YourRepository repository;
    
    @Test
    void shouldCreateEntity() {
        // Test implementation
    }
}
```

## Best Practices

1. **Feature Organization**
    - Keep related code together in feature packages
    - Use DTOs for API contracts
    - Follow consistent naming conventions

2. **Security**
    - Always use `SecureRepository` for data access
    - Implement proper validation
    - Use appropriate roles and permissions

3. **Event Handling**
    - Use events for cross-cutting concerns
    - Consider async events for long-running operations
    - Implement proper error handling

4. **Database**
    - Use Liquibase for all schema changes
    - Include meaningful changeSet IDs
    - Always provide rollback scripts

5. **API Design**
    - Use proper HTTP methods
    - Implement validation
    - Follow REST conventions

## Common Pitfalls

1. **Missing Tenant ID**
    - Ensure all entities have `@Tenant` annotation
    - Use `SecureRepository` consistently

2. **Security Context**
    - Always have a valid security context
    - Handle authentication properly

3. **Event Handling**
    - Don't block in event handlers
    - Handle exceptions appropriately

## Getting Started

1. Clone the repository and deattach from git
2. Configure `pom.xml` and `application.yml` with your database settings
3. Start the application (it will run Liquibase migrations)
4. Access Swagger UI at `/api/swagger-ui.html`
