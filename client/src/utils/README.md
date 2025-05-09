# Utilities Documentation

This directory contains utility functions and helpers used across the application.

## Organization Overview

We've centralized utility functions to apply the DRY (Don't Repeat Yourself) principle:

- **index.js**: Central export point for all utility functions
- **http-helpers.js**: HTTP/API request utilities
- **logger.js**: Centralized logging utilities
- **toast-config.js**: Toast notification configurations
- **image-helpers.js**: Image processing and optimization
- **product-url.js**: URL generation for products and categories
- **validation.js**: Form validation utilities

## Usage

### Import Utilities

```js
// Import specific utilities
import { logError, isValidEmail, getProductUrl } from '../utils';

// Or import grouped utilities
import { logger, validation, httpHelpers } from '../utils';
```

### HTTP Utilities

Standardized API calls:

```js
import { 
  apiRequest, 
  getAll, 
  getById, 
  API_ENDPOINTS 
} from '../utils';

// Examples
const products = await getAll(API_ENDPOINTS.PRODUCTS, { limit: 10 });
const user = await getById(API_ENDPOINTS.USERS, userId);
const response = await apiRequest('post', API_ENDPOINTS.AUTH, loginData);
```

### Logging

Consistent logging with context:

```js
import { logError, logInfo, logDebug } from '../utils';

// Examples
logError('Failed to load product', error, 'ProductComponent');
logInfo('User logged in successfully', { userId }, 'AuthService');
```

### Form Validation

Reusable validation functions:

```js
import { isValidEmail, isRequired, hasMinLength } from '../utils';

// Examples
const isValid = isValidEmail(email) && isRequired(password);
```

## Benefits

1. **Consistency**: Standard approach across the application
2. **Maintainability**: Changes can be made in a single location
3. **Reduced duplication**: Common code is reused
4. **Centralized configuration**: Easier to update defaults 