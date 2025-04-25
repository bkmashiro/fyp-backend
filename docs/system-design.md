# System Design Document

## 1. Overall Architecture

### 1.1 Technology Stack

#### 1.1.1 Core Technologies
- **Backend Framework**: NestJS
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **API Documentation**: Swagger/OpenAPI
- **Caching**: NestJS Cache Manager

#### 1.1.2 Additional Technologies
- **Blockchain**: Hedera Hashgraph
- **Zero Knowledge Proof**: Circom + SnarkJS
- **File Storage**: AWS S3
- **Image Processing**: Sharp
- **Geospatial Processing**: PostGIS

### 1.2 System Architecture

#### 1.2.1 Application Structure
- **Modular Design**: Each feature is encapsulated in its own module
- **Dependency Injection**: NestJS's built-in DI container
- **Middleware Pipeline**: Request processing pipeline
- **Interceptors**: Cross-cutting concerns handling
- **Guards**: Authentication and authorization
- **Pipes**: Data transformation and validation

#### 1.2.2 Security Architecture
- **Authentication**: JWT-based stateless authentication
- **Authorization**: Role-based access control (RBAC)
- **CORS**: Configurable cross-origin resource sharing
- **SSL/TLS**: Secure communication
- **Data Validation**: Class-validator integration

#### 1.2.3 Deployment Architecture
- **Environment Configuration**: Development, Production
- **Configuration Management**: Environment variables
- **Containerization**: Docker support
- **Load Balancing**: Horizontal scaling support
- **Monitoring**: Logging and error tracking

## 2. Module Breakdown

### 2.1 Core Modules

#### 2.1.1 AppModule
- **Purpose**: Application entry point
- **Responsibilities**:
  - Application configuration
  - Global middleware setup
  - Module imports
  - Service providers

#### 2.1.2 AuthModule
- **Purpose**: Authentication and authorization
- **Components**:
  - JWT strategy
  - Local strategy
  - Auth guards
  - Token generation and validation

#### 2.1.3 UserModule
- **Purpose**: User management
- **Features**:
  - User registration
  - User profile management
  - Password management
  - User roles assignment

#### 2.1.4 RoleModule
- **Purpose**: Role-based access control
- **Features**:
  - Role definition
  - Permission management
  - Role assignment
  - Access control lists

### 2.2 Geographic Modules

#### 2.2.1 GeoObjectModule
- **Purpose**: Geographic object management
- **Features**:
  - Object creation and management
  - Spatial queries
  - Object relationships
  - Metadata management

#### 2.2.2 GeoImageModule
- **Purpose**: Geographic image management
- **Features**:
  - Image upload and storage
  - Image processing
  - Geotagging
  - Image metadata management

#### 2.2.3 CloudAnchorModule
- **Purpose**: AR cloud anchor management
- **Features**:
  - Anchor creation and tracking
  - Spatial anchoring
  - Anchor persistence
  - Multi-user synchronization

### 2.3 Content Management Modules

#### 2.3.1 SceneModule
- **Purpose**: Scene management
- **Features**:
  - Scene creation and editing
  - Scene composition
  - Scene sharing
  - Scene versioning

#### 2.3.2 StoryboardModule
- **Purpose**: Storyboard management
- **Features**:
  - Story creation
  - Scene sequencing
  - Story sharing
  - Story analytics

#### 2.3.3 LabelModule
- **Purpose**: Content labeling
- **Features**:
  - Label creation
  - Label assignment
  - Label organization
  - Label search

### 2.4 Consensus Modules

#### 2.4.1 ConsensusModule
- **Purpose**: Distributed consensus
- **Features**:
  - Message propagation
  - State synchronization
  - Conflict resolution
  - Consensus algorithms

#### 2.4.2 ImageCopyrightModule
- **Purpose**: Image copyright management
- **Features**:
  - Copyright registration
  - Copyright verification
  - Blockchain integration
  - Dispute resolution

### 2.5 Utility Modules

#### 2.5.1 FileModule
- **Purpose**: File management
- **Features**:
  - File upload/download
  - File storage
  - File metadata
  - File access control

#### 2.5.2 StatisticsModule
- **Purpose**: Analytics and statistics
- **Features**:
  - Usage statistics
  - Performance metrics
  - User analytics
  - System monitoring

#### 2.5.3 ZkModule
- **Purpose**: Zero-knowledge proofs
- **Features**:
  - Proof generation
  - Proof verification
  - Circuit compilation
  - Privacy preservation

## 3. Database Design

### 3.1 Core Tables

#### 3.1.1 User System
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.1.2 File System
```sql
CREATE TABLE files (
    key VARCHAR(255) PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Geographic Tables

#### 3.2.1 Cloud Anchor
```sql
CREATE TABLE cloud_anchors (
    id SERIAL PRIMARY KEY,
    cloud_anchor_id VARCHAR(255) NOT NULL UNIQUE,
    anchor GEOMETRY(Point, 4326) NOT NULL,
    altitude FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 Consensus Tables

#### 3.3.1 Hedera Topics
```sql
CREATE TABLE hedera_topics (
    id UUID PRIMARY KEY,
    topic_id VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    memo TEXT,
    expiration_time TIMESTAMP NOT NULL,
    auto_renew_period INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.3.2 Image Copyright
```sql
CREATE TABLE image_copyrights (
    id UUID PRIMARY KEY,
    image_hash BIT(64) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_hash VARCHAR(255),
    message TEXT,
    message_prefix VARCHAR(8),
    blockchain_info JSONB,
    geo_image_id UUID REFERENCES geo_images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 Database Features

#### 3.4.1 Spatial Support
- PostGIS extension for geospatial data
- Spatial indexing for performance
- Geographic functions and operators
- Coordinate system support (SRID 4326)

#### 3.4.2 Data Integrity
- Foreign key constraints
- Unique constraints
- Check constraints
- Soft delete implementation

#### 3.4.3 Performance Optimization
- Indexed columns
- Materialized views
- Query optimization
- Connection pooling

#### 3.4.4 Data Types
- Native JSON/JSONB support
- Custom types (Point, Polygon)
- Enumerated types
- Timestamp with timezone

### 3.5 Database Maintenance

#### 3.5.1 Backup Strategy
- Regular backups
- Point-in-time recovery
- Backup verification
- Disaster recovery plan

#### 3.5.2 Monitoring
- Query performance monitoring
- Resource utilization tracking
- Error logging
- Alert system

#### 3.5.3 Optimization
- Regular vacuuming
- Index maintenance
- Statistics updates
- Query plan analysis 